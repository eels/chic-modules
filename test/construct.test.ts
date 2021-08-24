import construct from '../src/construct';
import styles from './__mocks__/styles.module.json';
import { ConstructOptions } from '../types';
import { createElement, createRef } from 'react';
import { render, screen } from '@testing-library/react';

describe('construct', () => {
  it('should render a basic component with no additional attrs', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters)));
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('heading');
  });

  it('should render a basic component with additional attrs', () => {
    const parameters: ConstructOptions = {
      attrs: { type: 'text' },
      classNames: 'input',
      styles: styles,
      target: 'input',
    };

    render(createElement(construct(parameters)));
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('should render a basic component with an array of class names', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: ['heading', 'hero'],
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters)));
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('heading hero');
  });

  it('should render an extended component', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    parameters.target = construct(parameters);
    parameters.classNames = 'extended';

    render(createElement(construct(parameters)));
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('heading extended');
  });

  it('should render a basic component without passing non-valid props as attributes', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { noneValidProp: true }));
    expect(screen.getByRole('heading')).not.toHaveAttribute('noneValidProp');
  });

  it('should not pass down any class that does not exist in the styles object', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'missing-heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters)));
    expect(screen.getByRole('heading')).not.toHaveClass('missing-heading');
  });

  it('should convert truthy props prefixed with `is` or `has` to class names', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { hasBorder: true, isPrimary: true }));
    expect(screen.getByRole('heading')).toHaveClass('heading--primary heading--border');
  });

  it('should not convert falsy props prefixed with `is` or `has` to class names', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { hasBorder: false, isPrimary: false }));
    expect(screen.getByRole('heading')).not.toHaveClass('heading--primary heading--border');
  });

  it('should convert truthy props prefixed with `with` to constructed class names', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { withWeight: 'bold' }));
    expect(screen.getByRole('heading')).toHaveClass('heading--weight-bold');
  });

  it('should not convert style props missing from styles object to class names', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { isSecondary: true }));
    expect(screen.getByRole('heading')).not.toHaveClass('heading--secondary');
  });

  it('should successfully forward and update component refs', () => {
    const ref = createRef<Element>();
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    expect(ref.current).toBeNull();
    render(createElement(construct(parameters), { ref: ref }));
    expect(typeof ref.current).toBe('object');
  });
});

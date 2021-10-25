import construct from '@src/core/construct';
import styles from '@test/__mocks__/styles.module.json';
import { createElement, createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ConstructOptions } from '@types';

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

  it('should throw and error when an invalid/missing class is provided', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'invalid',
      styles: styles,
      target: 'h1',
    };

    const consoleSpy = console as any;

    jest.spyOn(consoleSpy, 'error');
    consoleSpy.error.mockImplementation(() => {});

    expect(() => render(createElement(construct(parameters)))).toThrow();

    consoleSpy.error.mockRestore();
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

  it('should convert truthy props prefixed with `is` or `has` from `attrs` to class names', () => {
    const parameters: ConstructOptions = {
      attrs: { hasBorder: true, isPrimary: true },
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters)));
    expect(screen.getByRole('heading')).toHaveClass('heading--primary heading--border');
  });

  it('should convert truthy props prefixed with `with` from `attrs` to class names', () => {
    const parameters: ConstructOptions = {
      attrs: { withWeight: 'bold' },
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters)));
    expect(screen.getByRole('heading')).toHaveClass('heading--weight-bold');
  });

  it('should convert `is` and `has` props to be kebab cased class names', () => {
    const parameters: ConstructOptions = {
      attrs: { hasBorderDashed: true, isSansSerif: true },
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters)));
    expect(screen.getByRole('heading')).toHaveClass('heading--sans-serif heading--border-dashed');
  });

  it('should convert `with` props to be kebab cased class names', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { withFontSize: 'large' }));
    expect(screen.getByRole('heading')).toHaveClass('heading--font-size-large');
  });

  it('should dedupe class names where required', () => {
    const parameters: ConstructOptions = {
      attrs: { isPrimary: true },
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { isPrimary: true }));
    expect(screen.getByRole('heading')).toHaveClass('heading heading--primary');
  });

  it('should convert `style` props to a dynamically rendered class name', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    render(createElement(construct(parameters), { style: { color: 'red' } }));
    expect(screen.getByRole('heading')).toHaveClass('cmq487y5');
    expect(screen.getByRole('heading')).not.toHaveAttribute('style');
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

  it('should cache the computed class names for subsequent renders (coverage report)', () => {
    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'input',
      styles: styles,
      target: 'button',
    };

    const ButtonA = construct(parameters);
    const ButtonB = construct(parameters);

    const Wrapper = () => {
      const [counter, setCounter] = useState(0);
      const increase = () => setCounter(counter + 1);

      return createElement('div', null, [
        createElement(ButtonA, { key: 0, onClick: increase }, counter),
        createElement(ButtonB, { key: 1, style: { color: 'red' } }, 'static button'),
      ]);
    };

    render(createElement(Wrapper));

    expect(parseInt(screen.getAllByRole('button')[0].innerHTML)).toBe(0);

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(parseInt(screen.getAllByRole('button')[0].innerHTML)).toBe(1);
  });
});

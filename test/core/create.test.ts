import construct from '@src/core/construct';
import styles from '@test/__mocks__/styles.module.json';
import { create } from '@src/core/create';
import type { CSSModule, ConstructOptions } from '@types';

jest.mock('@src/core/construct', () => jest.fn());

describe('core/create', () => {
  it('should return a function with `attrs` defined as a property', () => {
    const styled = create({});

    expect(styled).toBeInstanceOf(Function);
    expect(styled).toHaveProperty('attrs');
    expect(styled.attrs).toBeInstanceOf(Function);
  });

  it('should accept dynamic properties and return a function with `attrs` defined as a property', () => {
    const styled = create({});

    expect(styled).toHaveProperty('h1');
    expect(styled.h1).toBeInstanceOf(Function);
    expect(styled.h1).toHaveProperty('attrs');
    expect(styled.h1.attrs).toBeInstanceOf(Function);
  });

  it('should call `construct` with the required options (basic)', () => {
    const styled = create(styles);

    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    styled('h1', 'heading');
    expect(construct).toBeCalledWith(parameters);
  });

  it('should call `construct` with the required options (basic w/ attrs)', () => {
    const styled = create(styles);

    const parameters: ConstructOptions = {
      attrs: { type: 'text' },
      classNames: 'input',
      styles: styles,
      target: 'input',
    };

    styled.attrs(parameters.attrs)('input', 'input');
    expect(construct).toBeCalledWith(parameters);
  });

  it('should call `construct` with the required options (tag)', () => {
    const styled = create(styles);

    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: styles,
      target: 'h1',
    };

    styled.h1('heading');
    expect(construct).toBeCalledWith(parameters);
  });

  it('should call `construct` with the required options (tag w/ attrs)', () => {
    const styled = create(styles);

    const parameters: ConstructOptions = {
      attrs: { type: 'text' },
      classNames: 'input',
      styles: styles,
      target: 'input',
    };

    styled.input.attrs(parameters.attrs)('input');
    expect(construct).toBeCalledWith(parameters);
  });

  it('should call `construct` with the required additional styles', () => {
    const styled = create(styles);

    const additionalStyles: CSSModule = {
      'additional-heading': 'additional-heading',
    };

    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: Object.assign({}, styles, additionalStyles),
      target: 'h1',
    };

    styled.h1('heading', additionalStyles);
    expect(construct).toBeCalledWith(parameters);
  });

  it('should allow the user to omit passing a value to the `create` method', () => {
    const styled = create();

    const additionalStyles: CSSModule = {
      'additional-heading': 'additional-heading',
    };

    const parameters: ConstructOptions = {
      attrs: {},
      classNames: 'heading',
      styles: additionalStyles,
      target: 'h1',
    };

    styled.h1('heading', additionalStyles);
    expect(construct).toBeCalledWith(parameters);
  });
});

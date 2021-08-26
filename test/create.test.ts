import construct from '../src/construct';
import create from '../src/create';
import styles from './__mocks__/styles.module.json';
import tags from '../types/tags';
import { ConstructOptions } from '../types';

jest.mock('../src/construct', () => jest.fn());

describe('create', () => {
  it('should return a function with `attrs` defined as a property', () => {
    const styled = create({});

    expect(styled).toBeInstanceOf(Function);
    expect(styled).toHaveProperty('attrs');
    expect(styled.attrs).toBeInstanceOf(Function);
  });

  it('should have all valid HTML5 elements defined as properties', () => {
    const styled = create({});

    for (const tag of tags) {
      expect(styled).toHaveProperty(tag);
      expect(styled[tag]).toBeInstanceOf(Function);

      expect(styled[tag]).toHaveProperty('attrs');
      expect(styled[tag].attrs).toBeInstanceOf(Function);
    }
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
});

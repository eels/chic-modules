import isValidProp from '@src/utils/isValidProp';

describe('utils/isValidProp', () => {
  it('should return true for valid DOM/React props', () => {
    const props = ['aria-label', 'data-key', 'className', 'children', 'onClick'];

    props.forEach((prop) => expect(isValidProp(prop)).toBe(true));
  });

  it('should return false for invalid DOM/React props', () => {
    const props = ['isPrimary', 'hasBorder', 'withTextColor'];

    props.forEach((prop) => expect(isValidProp(prop)).toBe(false));
  });
});

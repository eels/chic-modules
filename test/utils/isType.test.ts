import isType from '@src/utils/isType';

describe('utils/isType', () => {
  it('should return the correct boolean with a single type argument', () => {
    const exampleNumber = 100;

    expect(isType(exampleNumber, 'number')).toBe(true);
    expect(isType(exampleNumber, 'string')).toBe(false);
  });

  it('should return the correct boolean with an array type argument', () => {
    const exampleNumber = 100;

    expect(isType(exampleNumber, ['number', 'string'])).toBe(true);
    expect(isType(exampleNumber, ['object', 'string'])).toBe(false);
  });
});

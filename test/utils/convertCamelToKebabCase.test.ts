import convertCamelToKebabCase from '../../src/utils/convertCamelToKebabCase';

describe('utils/convertCamelToKebabCase', () => {
  it('should convert camel case strings to use kebab casing', () => {
    expect(convertCamelToKebabCase('ExampleString')).toBe('example-string');
  });
});

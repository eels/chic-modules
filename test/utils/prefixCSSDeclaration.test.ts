import prefixCSSDeclaration from '@src/utils/prefixCSSDeclaration';

describe('utils/prefixCSSDeclaration', () => {
  it('should return a basic constructed css rule', () => {
    const prefixedRule = prefixCSSDeclaration('background-color', 'black');

    expect(prefixedRule).toBe('background-color:black;');
  });

  it('should return a css rule with an alias property when required', () => {
    const prefixedRule = prefixCSSDeclaration('gap', '10px');

    expect(prefixedRule).toBe('grid-gap:10px;gap:10px;');
  });

  it('should return a css rule with a prefixed property when required', () => {
    const prefixedRule = prefixCSSDeclaration('backdrop-filter', 'none');

    expect(prefixedRule).toBe('-webkit-backdrop-filter:none;backdrop-filter:none;');
  });

  it('should return a css rule with a prefixed value when required', () => {
    const prefixedRule = prefixCSSDeclaration('position', 'sticky');

    expect(prefixedRule).toBe('position:-webkit-sticky;position:sticky;');
  });
});

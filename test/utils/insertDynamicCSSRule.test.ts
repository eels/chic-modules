import insertDynamicCSSRule from '@src/utils/insertDynamicCSSRule';
import { DYNAMIC_STYLES_STORE } from '@src/store/styles';

describe('utils/insertDynamicCSSRule', () => {
  beforeEach(() => {
    const customSheetElement = document.createElement('style');

    customSheetElement.setAttribute('data-chic', '');
    document.head.appendChild(customSheetElement);
  });

  afterEach(() => {
    const customSheetElement = document.querySelector('style[data-chic]');

    customSheetElement?.parentNode?.removeChild(customSheetElement);
  });

  it('should add rules to the stylesheet', () => {
    insertDynamicCSSRule('example-1', ['background-color:black;']);
    insertDynamicCSSRule('example-2', ['background-color:red;']);

    const dynamicStyleSheet = document.querySelector('style[data-chic]') as HTMLStyleElement;
    const rules = dynamicStyleSheet?.sheet?.cssRules;

    expect(rules).toHaveLength(2);
  });

  it('should ensure css rules are only added to the stylesheet once', () => {
    insertDynamicCSSRule('example', ['background-color:black;']);
    insertDynamicCSSRule('example', ['background-color:black;']);

    const dynamicStyleSheet = document.querySelector('style[data-chic]') as HTMLStyleElement;
    const rules = dynamicStyleSheet?.sheet?.cssRules;

    expect(rules).toHaveLength(1);
  });

  it('should ensure css rules are only added to the store once', () => {
    insertDynamicCSSRule('example', ['background-color:black;']);
    insertDynamicCSSRule('example', ['background-color:black;']);

    const output = '.example{background-color:black;}';
    const search = DYNAMIC_STYLES_STORE.filter((entry) => entry === output);

    expect(DYNAMIC_STYLES_STORE).toContain(output);
    expect(search).toHaveLength(1);
  });

  it('should not throw an error when run in a window-less environment', () => {
    const windowSpy = jest.spyOn(window, 'window', 'get') as any;

    windowSpy.mockImplementation(() => undefined);
    expect(() => insertDynamicCSSRule('example', ['background-color:black;'])).not.toThrow();

    windowSpy.mockRestore();
  });
});

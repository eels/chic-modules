import getDynamicStyleSheet from '../../src/utils/getDynamicStyleSheet';

describe('getDynamicStyleSheet', () => {
  afterEach(() => {
    const element = document.querySelector('style[data-chic]');

    element?.parentNode?.removeChild(element);
  });

  it('should create and return the dynamic style element if there is none present', () => {
    const sheet = getDynamicStyleSheet();
    const element = document.querySelector('style[data-chic]');

    expect(sheet).toBeTruthy();
    expect(element).toHaveAttribute('data-chic');
    expect(element).not.toHaveAttribute('data-chic-custom');
    expect(element).toEqual(sheet);
  });

  it('should create and return the dynamic style element if there is none present', () => {
    const customSheetElement = document.createElement('style');

    customSheetElement.setAttribute('data-chic', '');
    customSheetElement.setAttribute('data-chic-custom', '');
    document.head.appendChild(customSheetElement);

    const sheet = getDynamicStyleSheet();
    const element = document.querySelector('style[data-chic]');

    expect(sheet).toBeTruthy();
    expect(element).toHaveAttribute('data-chic');
    expect(element).toHaveAttribute('data-chic-custom');
    expect(element).toEqual(sheet);
  });
});

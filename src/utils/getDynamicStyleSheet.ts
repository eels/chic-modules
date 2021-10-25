export default function getDynamicStyleSheet(target?: Document): HTMLStyleElement {
  const element = target || document;
  const sheet = element.querySelector('style[data-chic]');

  if (sheet !== null) {
    return sheet as HTMLStyleElement;
  }

  const head = element.head;
  const createdSheet = element.createElement('style');

  createdSheet.setAttribute('data-chic', '');
  head.appendChild(createdSheet);

  return createdSheet;
}

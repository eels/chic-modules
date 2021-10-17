export default function getDynamicStyleSheet(): HTMLStyleElement {
  const sheet = document.querySelector('style[data-chic]');

  if (sheet !== null) {
    return sheet as HTMLStyleElement;
  }

  const head = document.head;
  const createdSheet = document.createElement('style');

  createdSheet.setAttribute('data-chic', '');
  head.appendChild(createdSheet);

  return getDynamicStyleSheet();
}

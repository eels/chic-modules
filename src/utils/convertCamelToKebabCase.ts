export default function convertCamelToKebabCase(string: string) {
  function replacer(letter: string, offset: number) {
    return `${offset !== 0 ? '-' : ''}${letter.toLowerCase()}`;
  }

  return string.replace(/[A-Z]/g, replacer);
}

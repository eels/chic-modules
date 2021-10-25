export default function convertCamelToKebabCase(string: string) {
  return string.replace(/[A-Z]/g, (letter: string, offset: number) => {
    return `${offset !== 0 ? '-' : ''}${letter.toLowerCase()}`;
  });
}

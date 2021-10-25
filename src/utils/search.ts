export default function search<T = any>(array: T[], callback: (item: T) => boolean) {
  const result = [];

  for (const item of array) {
    if (callback(item)) {
      result.push(item);
    }
  }

  return result.length !== 0 ? result[0] : false;
}

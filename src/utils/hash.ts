export default function hash(input: string) {
  let hash = 0;
  let i = input.length;

  if (i === 0) {
    return hash;
  }

  while (i) {
    hash = (hash << 5) - hash + input.charCodeAt(--i);
    hash |= 0;
  }

  return hash;
}

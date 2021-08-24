export default function isType<T = any>(target: T, primitive: string | string[]) {
  const primitiveArray = Array.isArray(primitive) ? primitive : [primitive];

  return primitiveArray.some((type) => typeof target === type);
}

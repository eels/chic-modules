import isType from '@src/utils/isType';

export default function circularStringify(object: Object) {
  const references = new WeakSet();

  return JSON.stringify(object, (_: string, value: any) => {
    if (value !== null && isType(value, 'object')) {
      if (references.has(value)) {
        return;
      }

      references.add(value);
    }

    return value;
  });
}

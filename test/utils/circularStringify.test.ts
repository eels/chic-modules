import circularStringify from '@src/utils/circularStringify';
import type { ExtendableObject } from '@types';

describe('utils/circularStringify', () => {
  it('should successfully stringify circular objects', () => {
    const object: ExtendableObject = {
      package: 'chic-modules',
      private: false,
    };

    object.self = object;

    const output = JSON.stringify({
      package: 'chic-modules',
      private: false,
    });

    expect(circularStringify(object)).toEqual(output);
  });
});

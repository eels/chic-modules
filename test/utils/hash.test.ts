import hash from '../../src/utils/hash';

describe('utils/hash', () => {
  it('should return zero for inputs with a length of zero', () => {
    expect(hash('')).toBe(0);
  });

  it('should return a number hash for inputs with a non-zero length', () => {
    expect(hash('example string')).not.toBe(0);
    expect(typeof hash('exaple string')).toBe('number');
  });

  it('should always return the same hash value for matching inputs', () => {
    const hash1 = hash('example string');
    const hash2 = hash('example string');

    expect([hash1, hash2].every((hash, _, array) => hash === array[0])).toBe(true);
  });
});

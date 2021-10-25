import search from '@src/utils/search';

describe('utils/search', () => {
  it('should return a found item', () => {
    const array = [1, 2, 3, 4, 5];
    const lookup = search<number>(array, (item) => item === 3);

    expect(lookup).toBeTruthy();
    expect(lookup).toBe(3);
  });

  it('should return false when no item is found', () => {
    const array = [1, 2, 3, 4, 5];
    const lookup = search<number>(array, (item) => item === 6);

    expect(lookup).not.toBeTruthy();
    expect(lookup).toBe(false);
  });
});

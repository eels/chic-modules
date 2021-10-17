import { DYNAMIC_STYLES_CACHE, extractDynamicStyles } from '../../src/core/extractDynamicStyles';

describe('extractDynamicStyles', () => {
  it('should return the dynamic styles cache', () => {
    expect(extractDynamicStyles()).toBe('');

    DYNAMIC_STYLES_CACHE.push('.example{background:red;}');

    expect(extractDynamicStyles()).toBe('.example{background:red;}');
  });
});

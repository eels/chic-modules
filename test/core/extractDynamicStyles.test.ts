import { DYNAMIC_STYLES_STORE } from '@src/store/styles';
import { extractDynamicStyles } from '@src/core/extractDynamicStyles';

describe('core/extractDynamicStyles', () => {
  it('should return the dynamic styles store', () => {
    expect(extractDynamicStyles()).toBe('');

    DYNAMIC_STYLES_STORE.push('.example{background:red;}');

    expect(extractDynamicStyles()).toBe('.example{background:red;}');
  });
});

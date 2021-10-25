import { DYNAMIC_STYLES_STORE } from '@src/store/styles';

export function extractDynamicStyles() {
  return DYNAMIC_STYLES_STORE.join('');
}

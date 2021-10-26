import { DYNAMIC_STYLES_STORE } from '@src/store/styles';

export default function extractDynamicStyles() {
  return DYNAMIC_STYLES_STORE.join('');
}

export const DYNAMIC_STYLES_CACHE = <string[]>[];

export function extractDynamicStyles() {
  return DYNAMIC_STYLES_CACHE.join('');
}

import getDynamicStyleSheet from '@src/utils/getDynamicStyleSheet';
import { DYNAMIC_STYLES_CACHE } from '@src/core/extractDynamicStyles';

export default function insertDynamicCSSRule(selector: string, styles: string[]) {
  const constructedRule = `.${selector}{${styles.join('')}}`;

  if (typeof window === 'object') {
    const sheet = getDynamicStyleSheet().sheet as CSSStyleSheet;
    let isRuleAlreadyDefined = false;

    for (const rule of sheet.cssRules) {
      const sheetStyleRule = rule as CSSStyleRule;

      if (sheetStyleRule.selectorText === `.${selector}`) {
        isRuleAlreadyDefined = true;
        break;
      }
    }

    !isRuleAlreadyDefined && sheet?.insertRule(constructedRule);
  }

  if (!DYNAMIC_STYLES_CACHE.includes(constructedRule)) {
    DYNAMIC_STYLES_CACHE.push(constructedRule);
  }
}

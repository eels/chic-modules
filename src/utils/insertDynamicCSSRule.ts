import getDynamicStyleSheet from '@src/utils/getDynamicStyleSheet';
import search from '@src/utils/search';
import { DYNAMIC_STYLES_STORE } from '@src/store/styles';

export default function insertDynamicCSSRule(selector: string, styles: string[]) {
  const constructedRule = `.${selector}{${styles.join('')}}`;

  if (typeof window === 'object') {
    const sheet = getDynamicStyleSheet().sheet as CSSStyleSheet;
    const rules = <CSSStyleRule[]>[...sheet.cssRules];

    const isRuleAlreadyDefined = search<CSSStyleRule>(rules, (item) => {
      return item.selectorText === `.${selector}`;
    });

    !isRuleAlreadyDefined && sheet?.insertRule(constructedRule);
  }

  if (!DYNAMIC_STYLES_STORE.includes(constructedRule)) {
    DYNAMIC_STYLES_STORE.push(constructedRule);
  }
}

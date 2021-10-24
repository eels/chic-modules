import cc from 'classcat';
import circularStringify from '../utils/circularStringify';
import convertCamelToKebabCase from '../utils/convertCamelToKebabCase';
import generateDisplayName from '../utils/generateDisplayName';
import hash from '../utils/hash';
import insertDynamicCSSRule from '../utils/insertDynamicCSSRule';
import isType from '../utils/isType';
import isValidProp from '@emotion/is-prop-valid';
import prefixCSSDeclaration from '../utils/prefixCSSDeclaration';
import { createElement, forwardRef } from 'react';
import type { ChicProps, ConstructOptions, ExtendableObject } from '../../types';
import type { Ref } from 'react';

export default function construct<Props = ChicProps>(options: ConstructOptions<Props>) {
  const { attrs, classNames, styles, target } = options;

  function wrapper() {
    const cache: ExtendableObject = {};
    const name = generateDisplayName(<any>target);

    function styled(props: Props, ref: Ref<Element>) {
      const constructedProps = <ChicProps>Object.assign({}, attrs, props);
      const constructedPropsHash = hash(circularStringify(constructedProps));
      const constructedPropsKeys = Object.keys(constructedProps);

      const isSingularClassName = isType(classNames, 'string');
      const classNamesArray = <string[]>(!isSingularClassName ? classNames : [classNames]);
      const prefixes = ['has', 'is', 'with'];
      const prefixesRegex = new RegExp(`^(${prefixes.join('|')})`);

      if (!cache[constructedPropsHash]) {
        for (const className of classNamesArray) {
          const stylesLookup = styles[className];
          const modifiers: ExtendableObject<Props[Extract<keyof Props, string>]> = {};

          if (!stylesLookup) {
            continue;
          }

          for (const prop of constructedPropsKeys) {
            const propValue = constructedProps[prop];

            if (!prefixes.some((prefix) => !!prop.match(`^${prefix}`)) || !propValue) {
              continue;
            }

            const prefix = prop.match(prefixesRegex)?.[0];
            const modifier = convertCamelToKebabCase(prop.replace(prefixesRegex, ''));

            const baseClassName = `${className}--${modifier.toLowerCase()}`;
            const modifierValueExtention = prefix === 'with' ? `-${propValue}` : '';
            const constructedClassName = `${baseClassName}${modifierValueExtention}`;
            const constructedStylesLookup = styles[constructedClassName];

            if (constructedStylesLookup) {
              modifiers[constructedStylesLookup] = propValue;
            }
          }

          constructedProps.className = cc([stylesLookup, modifiers, constructedProps.className]);
        }

        cache[constructedPropsHash] = constructedProps.className;
      }

      constructedProps.className = cache[constructedPropsHash];

      const as = constructedProps.as || target;
      const hasValidAs = isType(as, ['function', 'object', 'string']);
      const isTargetObject = isType(target, 'object');
      const element = hasValidAs && !isTargetObject ? as : target;

      if (!isTargetObject) {
        for (const prop of constructedPropsKeys) {
          if (!isValidProp(prop)) {
            delete constructedProps[prop];
          }
        }

        if (constructedProps.style && isType(constructedProps.style, 'object')) {
          const classNamesHash = hash(classNamesArray.join(''));
          const stylesHash = hash(JSON.stringify(constructedProps.style));
          const combinedClassNameStyleHash = hash(`${classNamesHash}${stylesHash}`).toString(36);

          if (!cache[combinedClassNameStyleHash]) {
            const stylesClassName = `cm${combinedClassNameStyleHash}`;
            const styles = <string[]>[];

            constructedProps.className = cc([constructedProps.className, stylesClassName]);

            for (const [property, value] of Object.entries(constructedProps.style)) {
              const kebabCasedProperty = convertCamelToKebabCase(property);
              const rule = prefixCSSDeclaration(kebabCasedProperty, value);

              styles.push(rule);
            }

            insertDynamicCSSRule(stylesClassName, styles);

            cache[combinedClassNameStyleHash] = constructedProps.className;
          }

          delete constructedProps.style;

          constructedProps.className = cache[combinedClassNameStyleHash];
        }
      }

      const propsToForward = Object.assign({}, constructedProps, ref ? { ref } : {});

      return createElement(element, propsToForward, constructedProps.children ?? null);
    }

    Object.defineProperty(styled, 'name', { value: name });

    return forwardRef(styled);
  }

  return wrapper();
}

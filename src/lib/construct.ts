import cc from 'classcat';
import circularStringify from '@src/utils/circularStringify';
import convertCamelToKebabCase from '@src/utils/convertCamelToKebabCase';
import generateDisplayName from '@src/utils/generateDisplayName';
import hash from '@src/utils/hash';
import insertDynamicCSSRule from '@src/utils/insertDynamicCSSRule';
import isType from '@src/utils/isType';
import isValidProp from '@emotion/is-prop-valid';
import prefixCSSDeclaration from '@src/utils/prefixCSSDeclaration';
import { createElement, forwardRef } from 'react';
import type { ChicProps, ConstructOptions, ExtendableObject } from '@types';
import type { Ref } from 'react';

export default function construct<Props = ChicProps>(options: ConstructOptions<Props>) {
  const { attrs, classNames, styles, target } = options;
  const prefixes = ['has', 'is', 'with'];
  const prefixesRegex = new RegExp(`^(${prefixes.join('|')})`);
  const isSingularClassName = isType(classNames, 'string');
  const classNamesArray = <string[]>(!isSingularClassName ? classNames : [classNames]);

  function wrapper() {
    const cache: ExtendableObject = {};
    const name = generateDisplayName(<any>target);

    function styled(props: Props, ref: Ref<Element>) {
      const constructedProps = <ChicProps>Object.assign({}, attrs, props);
      const constructedPropsHash = hash(circularStringify(constructedProps));
      const constructedPropsKeys = Object.keys(constructedProps);
      const as = constructedProps.as || target;
      const hasValidAs = isType(as, ['function', 'object', 'string']);
      const isTargetObject = isType(target, 'object');
      const element = hasValidAs && !isTargetObject ? as : target;

      if (!cache[constructedPropsHash]) {
        for (const className of classNamesArray) {
          if (!styles[className]) {
            throw new Error(`Target class "${className}" does not exist in provided module`);
          }

          const stylesLookup = styles[className];
          const modifiers: ExtendableObject<Props[Extract<keyof Props, string>]> = {};

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

      const propsRefObject = ref ? { ref } : {};
      const propsToForward = Object.assign({}, constructedProps, propsRefObject);
      const children = constructedProps.children ?? null;

      return createElement(element, propsToForward, children);
    }

    Object.defineProperty(styled, 'name', { value: name });

    return forwardRef(styled);
  }

  return wrapper();
}

import cc from 'classcat';
import convertCamelToKebabCase from '@src/utils/convertCamelToKebabCase';
import generateDisplayName from '@src/utils/generateDisplayName';
import hash from '@src/utils/hash';
import insertDynamicCSSRule from '@src/utils/insertDynamicCSSRule';
import isType from '@src/utils/isType';
import isValidProp from '@emotion/is-prop-valid';
import prefixCSSDeclaration from '@src/utils/prefixCSSDeclaration';
import { createElement, forwardRef } from 'react';
import type { ChicProps, ConstructOptions, ExtendableObject } from '@types';
import type { Class } from 'classcat';
import type { Ref } from 'react';

export default function construct<Props = ChicProps>(options: ConstructOptions<Props>) {
  const { attrs, classNames, styles, target } = options;
  const prefixes = ['has', 'is', 'with'];
  const prefixesRegex = new RegExp(`^(${prefixes.join('|')})`);
  const isSingularClassName = isType(classNames, 'string');
  const isTargetObject = isType(target, 'object');
  const classNamesArray = <string[]>(!isSingularClassName ? classNames : [classNames]);
  const classNamesHash = hash(classNamesArray.join(''));

  function wrapper() {
    const name = generateDisplayName(<any>target);

    function styled(props: Props, ref: Ref<Element>) {
      const constructedProps = <ChicProps>Object.assign({}, attrs, props);
      const constructedPropsEntries = Object.entries(constructedProps);
      const as = constructedProps.as || target;
      const hasValidAs = isType(as, ['function', 'object', 'string']);
      const element = hasValidAs && !isTargetObject ? as : target;
      const componentClassNames = <Class[]>[];
      const dynamicStyleClassNames = <string[]>[];
      const modifiers: ExtendableObject<Props[Extract<keyof Props, string>]> = {};

      if (constructedPropsEntries.length === 0) {
        constructedPropsEntries.push([`__chic-${Date.now().toString(36)}`, false]);
      }

      for (const [prop, value] of constructedPropsEntries) {
        for (const className of classNamesArray) {
          const stylesLookup = styles[className];

          if (!stylesLookup) {
            throw new Error(`Target class "${className}" does not exist in provided module`);
          }

          componentClassNames.push(stylesLookup);

          if (prefixes.some((prefix) => !!prop.match(`^${prefix}`))) {
            const prefix = prop.match(prefixesRegex)?.[0];
            const modifier = convertCamelToKebabCase(prop.replace(prefixesRegex, ''));
            const baseClassName = `${className}--${modifier.toLowerCase()}`;
            const modifierValueExtention = prefix === 'with' ? `-${value}` : '';
            const constructedClassName = `${baseClassName}${modifierValueExtention}`;
            const constructedStylesLookup = styles[constructedClassName];

            if (constructedStylesLookup) {
              modifiers[constructedStylesLookup] = value;
            }
          }
        }

        if (!isTargetObject && !isValidProp(prop)) {
          delete constructedProps[prop];
        }

        if (!isTargetObject && prop === 'style' && isType(value, 'object')) {
          const styleHash = hash(JSON.stringify(value));
          const constructedStyleHash = hash(`${classNamesHash}${styleHash}`).toString(36);
          const styleEntries = Object.entries(value);
          const styleClassName = `cm${constructedStyleHash}`;
          const dynamicStyles = <string[]>[];

          delete constructedProps.style;
          dynamicStyleClassNames.push(styleClassName);

          for (const [property, value] of styleEntries) {
            dynamicStyles.push(prefixCSSDeclaration(convertCamelToKebabCase(property), value));
          }

          insertDynamicCSSRule(styleClassName, dynamicStyles);
        }
      }

      componentClassNames.push(modifiers, dynamicStyleClassNames, constructedProps.className);

      constructedProps.className = cc(componentClassNames);

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

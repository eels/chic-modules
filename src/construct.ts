import convertCamelToKebabCase from './utils/convertCamelToKebabCase';
import cx from 'classnames/dedupe';
import generateDisplayName from './utils/generateDisplayName';
import isType from './utils/isType';
import isValidProp from '@emotion/is-prop-valid';
import { ChicProps, ConstructOptions, ExtendableObject } from '../types';
import { Ref, createElement, forwardRef } from 'react';

export default function construct<Props = ChicProps>(options: ConstructOptions<Props>) {
  const { attrs, classNames, styles, target } = options;

  function wrapper() {
    function styled(props: Props, ref: Ref<Element>) {
      const constructedProps = <ChicProps>Object.assign({}, attrs, props);
      const constructedPropsKeys = Object.keys(constructedProps);
      const propsKeys = Object.keys(props);

      const as = constructedProps.as || target;
      const hasValidAs = isType(as, ['function', 'object', 'string']);
      const element = hasValidAs && !isType(target, 'object') ? as : target;
      const isTargetObject = isType(target, 'object');

      for (const prop of constructedPropsKeys) {
        if (!isValidProp(prop) && !isTargetObject) {
          delete constructedProps[prop];
        }
      }

      const isSingularClassName = isType(classNames, 'string');
      const classNamesArray = <string[]>(!isSingularClassName ? classNames : [classNames]);
      const prefixes = ['has', 'is', 'with'];
      const prefixesRegex = new RegExp(`^(${prefixes.join('|')})`);

      for (const className of classNamesArray) {
        const stylesLookup = styles[className];
        const modifiers: ExtendableObject<Props[Extract<keyof Props, string>]> = {};

        if (!stylesLookup) {
          continue;
        }

        for (const prop of propsKeys) {
          const propValue = (<ChicProps>props)[prop];

          if (!prefixes.some((prefix) => !!prop.match(`^${prefix}`)) || !propValue) {
            continue;
          }

          const prefix = prop.match(prefixesRegex)?.[0];
          const modifier = prop.replace(prefixesRegex, '').toLowerCase();

          const baseClassName = `${className}--${convertCamelToKebabCase(modifier)}`;
          const modifierValueExtention = prefix === 'with' ? `-${propValue}` : '';
          const constructedClassName = `${baseClassName}${modifierValueExtention}`;
          const constructedStylesLookup = styles[constructedClassName];

          if (constructedStylesLookup) {
            modifiers[constructedStylesLookup] = propValue;
          }
        }

        constructedProps.className = cx(stylesLookup, modifiers, constructedProps.className);
      }

      const propsToForward = Object.assign({}, constructedProps, ref ? { ref } : {});

      return createElement(element, propsToForward, constructedProps.children ?? null);
    }

    Object.defineProperty(styled, 'name', { value: generateDisplayName(<any>target) });

    return forwardRef(styled);
  }

  return wrapper();
}

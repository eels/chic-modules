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

      const as = constructedProps.as || target;
      const hasValidAs = isType(as, ['function', 'object', 'string']);
      const element = hasValidAs && !isType(target, 'object') ? as : target;

      for (const prop in constructedProps) {
        if (!isValidProp(prop) && !isType(target, 'object')) {
          delete constructedProps[prop];
        }
      }

      const isSingularClassName = isType(classNames, 'string');
      const classNamesArray = <string[]>(!isSingularClassName ? classNames : [classNames]);

      for (const className of classNamesArray) {
        if (!styles[className]) {
          continue;
        }

        const modifiers: ExtendableObject<Props[Extract<keyof Props, string>]> = {};
        const prefixes = ['has', 'is', 'with'];
        const prefixesRegex = new RegExp(`^(${prefixes.join('|')})`);

        for (const prop in props) {
          if (!prefixes.some((prefix) => prop.startsWith(prefix)) || !props[prop]) {
            continue;
          }

          const prefix = prop.match(prefixesRegex)?.[0];
          const modifier = prop.replace(prefixesRegex, '').toLowerCase();

          const baseClassName = `${className}--${convertCamelToKebabCase(modifier)}`;
          const modifierValueExtention = prefix === 'with' ? `-${props[prop]}` : '';
          const constructedClassName = `${baseClassName}${modifierValueExtention}`;

          if (styles[constructedClassName]) {
            modifiers[styles[constructedClassName]] = props[prop];
          }
        }

        constructedProps.className = cx(styles[className], modifiers, constructedProps.className);
      }

      const propsToForward = Object.assign({}, constructedProps, ref ? { ref } : {});

      return createElement(element, propsToForward, constructedProps.children ?? null);
    }

    Object.defineProperty(styled, 'name', { value: generateDisplayName(<any>target) });

    return forwardRef(styled);
  }

  return wrapper();
}

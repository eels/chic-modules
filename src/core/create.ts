import construct from '@src/lib/construct';
import type { Attrs, CSSModule, ChicFactory, ChicFunction, ChicTagFunction } from '@types';

export default function create(styles: CSSModule = {}) {
  const Chic: ChicFunction = (target, classNames, additionalStyles?) => {
    return construct({
      attrs: {},
      classNames: classNames,
      styles: Object.assign({}, styles, additionalStyles ?? {}),
      target: target,
    });
  };

  Object.defineProperty(Chic, 'attrs', {
    value: function (attrs: Attrs): ChicFunction {
      return (target, classNames, additionalStyles?) => {
        return construct({
          attrs: attrs,
          classNames: classNames,
          styles: Object.assign({}, styles, additionalStyles ?? {}),
          target: target,
        });
      };
    },
  });

  const ChicProxy = new Proxy(Chic, {
    get(target: ChicFactory, property: string) {
      if (Reflect.has(target, property)) {
        return Reflect.get(target, property);
      }

      const ChicTag: ChicTagFunction = (classNames, additionalStyles?) => {
        return construct({
          attrs: {},
          classNames: classNames,
          styles: Object.assign({}, styles, additionalStyles ?? {}),
          target: property,
        });
      };

      Object.defineProperty(ChicTag, 'attrs', {
        value: function (attrs: Attrs): ChicTagFunction {
          return (classNames, additionalStyles?) => {
            return construct({
              attrs: attrs,
              classNames: classNames,
              styles: Object.assign({}, styles, additionalStyles ?? {}),
              target: property,
            });
          };
        },
      });

      return ChicTag;
    },
  });

  return ChicProxy as ChicFactory;
}

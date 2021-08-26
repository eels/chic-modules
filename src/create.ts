import construct from './construct';
import tags from '../types/tags';
import { Attrs, CSSModule, ChicFactory, ChicFunction, ChicTagFunction } from '../types';

export default function create(styles: CSSModule) {
  const Chic: ChicFunction = (target, classNames, overrideStyles?) => {
    return construct({
      attrs: {},
      classNames: classNames,
      styles: overrideStyles ?? styles,
      target: target,
    });
  };

  Object.defineProperty(Chic, 'attrs', {
    value: function (attrs: Attrs): ChicFunction {
      return (target, classNames, overrideStyles?) => {
        return construct({
          attrs: attrs,
          classNames: classNames,
          styles: overrideStyles ?? styles,
          target: target,
        });
      };
    },
  });

  const ChicTags = tags.reduce((object, tag) => {
    const ChicTag: ChicTagFunction = (classNames, overrideStyles?) => {
      return construct({
        attrs: {},
        classNames: classNames,
        styles: overrideStyles ?? styles,
        target: tag,
      });
    };

    Object.defineProperty(ChicTag, 'attrs', {
      value: function (attrs: Attrs): ChicTagFunction {
        return (classNames, overrideStyles?) => {
          return construct({
            attrs: attrs,
            classNames: classNames,
            styles: overrideStyles ?? styles,
            target: tag,
          });
        };
      },
    });

    object[tag] = {
      value: ChicTag,
    };

    return object;
  }, Object.create({}));

  Object.defineProperties(Chic, ChicTags);

  Object.freeze(Chic);

  return Chic as ChicFactory;
}

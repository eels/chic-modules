import tags from './tags';
import type { ComponentType, ForwardRefExoticComponent, PropsWithoutRef } from 'react';

declare module 'html-attributes' {
  const attributes: { [key: string]: string };

  export default attributes;
}

declare module 'svg-attributes' {
  const attributes: { [key: string]: string };

  export default attributes;
}

export type ExtendableObject<T = any> = { [key: string]: T };

export type AttrProps = ExtendableObject;

export type Attrs<T = AttrProps> = T;

export type ClassNames = string | string[] | undefined;

export type CSSModule = ExtendableObject<string>;

export type ChicProps = ExtendableObject;

export type ChicComponent<T = ChicProps> = ForwardRefExoticComponent<PropsWithoutRef<T>>;

export type ChicTarget<T = ChicProps> = string | ComponentType<T> | ChicComponent<T>;

export type ConstructOptions<T = ChicProps> = {
  attrs: Attrs;
  classNames: ClassNames;
  styles: CSSModule;
  target: ChicTarget<T>;
};

export type ChicFunction = <T = ChicProps>(
  target: ChicTarget<T>,
  classNames: ClassNames,
  additionalStyles?: CSSModule,
) => ChicComponent<T>;

export type ChicAttrsInterface = {
  attrs: <T = AttrProps>(attrs: Attrs<T extends object ? T : never>) => ChicFunction;
};

export type ChicTagFunction = <T = ChicProps>(
  classNames: ClassNames,
  additionalStyles?: CSSModule,
) => ChicComponent<T>;

export type ChicTagWithAttrsInterface = {
  [key in typeof tags[number]]: ChicTagFunction & {
    attrs: <T = AttrProps>(attrs: Attrs<T extends object ? T : never>) => ChicTagFunction;
  };
};

export type ChicFactory = ChicFunction & ChicAttrsInterface & ChicTagWithAttrsInterface;

export function create(styles?: CSSModule): ChicFactory;

export function extractDynamicStyles(): string[];

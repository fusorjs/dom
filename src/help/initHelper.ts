import {createElement} from '../createElement';
import {init} from '../init';
import {
  InitElementHelper,
  NamespaceUri,
  TagName,
  TaggedInitter,
  CustomInitter,
} from '../types';
import {svgNamespace} from './constants';

export const h: CustomInitter<HTMLElement> = (tagName, ...args) =>
  initHelper(undefined, tagName as TagName, args) as any;

export const s: CustomInitter<SVGElement> = (tagName, ...args) =>
  initHelper(svgNamespace, tagName as TagName, args) as any;

/** @deprecated */
export const initHelper: InitElementHelper = (namespace, tagName, args) => {
  const [props] = args as any;
  const element = createElement(
    namespace,
    tagName,
    props?.constructor === Object ? props : undefined,
  );

  return init(element, args) as any;
};

export const getTaggedInitHelper =
  (namespace: NamespaceUri | undefined) =>
  <T extends Element>(tagName: string): TaggedInitter<T> =>
  (...args) =>
    initHelper(namespace, tagName as TagName, args) as any;

export const getTaggedInitMapHelper = <M, K extends keyof M>(
  getCreator: (tagName: K) => M[K],
  tagNames: readonly K[],
) => {
  const tagged: M = {} as M;

  for (const name of tagNames) {
    tagged[name] = getCreator(name);
  }

  return tagged;
};

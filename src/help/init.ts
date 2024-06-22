import {createElement} from '../createElement';
import {init} from '../init';
import {ElementInitter, NamespaceUri, TagName, TaggedInitter} from '../types';

/** @deprecated */
export const initElementHelper: ElementInitter<Element> = (
  namespace,
  tagName,
  args,
) => {
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
    initElementHelper(namespace, tagName as TagName, args) as any;

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

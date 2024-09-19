import {NameSpace, TagName, FunctionalNotation} from '../types';
import {initHelper} from '../hyper';

export const getTaggedInitHelper =
  (namespace: NameSpace | undefined) =>
  <T extends Element>(tagName: string): FunctionalNotation<T> =>
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

import {initFn, Options} from '../initFn';
import {ElementInitter, TaggedInitter} from '../types';

/** @deprecated */
export const initElementHelper: ElementInitter<Element> = (
  namespace,
  tagName,
  args,
) => {
  let options: ElementCreationOptions | undefined;

  /* Using Options class is a better aproach */
  // const arg = args[0];
  // if (arg?.constructor === Object) {
  //   const {is} = arg as any;
  //   if (typeof is === 'string') options = {is};
  // }

  // Why two args? See: defaultButtonProps = {type: 'button'} in html.ts. But do not rely on the second option as this probably will change.
  const [arg0, arg1] = args;
  if (arg0 instanceof Options) options = arg0.options;
  if (arg1 instanceof Options) options = arg1.options;

  const element = namespace
    ? document.createElementNS(namespace, tagName, options)
    : document.createElement(tagName, options);

  return initFn(element, args) as any;
};

export const getTaggedInitHelper =
  (namespace: string | undefined) =>
  <T extends Element>(tagName: string): TaggedInitter<T> =>
  (...args) =>
    initElementHelper(namespace, tagName, args) as any;

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

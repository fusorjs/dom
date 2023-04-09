import {create, Options} from '../create';
import {ElementCreator, TaggedCreator} from '../types';

export const createElement: ElementCreator<Element> = (
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

  // Why two args? See: defaultButtonProps = {type: 'button'}
  const [arg0, arg1] = args;
  if (arg0 instanceof Options) options = arg0.options;
  if (arg1 instanceof Options) options = arg1.options;

  const element = namespace
    ? document.createElementNS(namespace, tagName, options)
    : document.createElement(tagName, options);

  return create(element, args) as any;
};

export const getTaggedCreator =
  (namespace: string | undefined) =>
  <T extends Element>(tagName: string): TaggedCreator<T> =>
  (...args) =>
    createElement(namespace, tagName, args) as any;

export const getTaggedCreatorMap = <M, K extends keyof M>(
  getCreator: (tagName: K) => M[K],
  tagNames: readonly K[],
) => {
  const tagged: M = {} as M;

  for (const name of tagNames) {
    tagged[name] = getCreator(name);
  }

  return tagged;
};

import {
  DynamicChild,
  Prop,
  DynamicProps,
  SingleChild,
  Creator,
  ElementCreator,
  TaggedCreator,
} from './types';
import {createProp} from './prop/create';
import {initChild} from './child';
import {Component} from './component';

export class Options {
  constructor(readonly options: ElementCreationOptions) {}
}

export const create: Creator = (element, args) => {
  let props: DynamicProps | undefined;
  let children: DynamicChild<Element>[] | undefined;

  const {length} = args;

  for (let index = 0; index < length; index++) {
    const arg = args[index];

    // skip options
    if (arg instanceof Options) {
      // ! Do not throw, as arrays could be reused, so we won't have to mutate/re-create them !
      // if (index !== 0) throw new Error('Options must be a first child');
    }

    // init props
    else if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        const prop = createProp(element, key, val as Prop);

        if (prop) {
          if (props) props[key] = prop;
          else props = {[key]: prop};
        }
      }
    }

    // init children
    else if (Array.isArray(arg)) {
      for (const a of arg) {
        const child = initChild(element, a);

        if (child) {
          if (children) children.push(child);
          else children = [child];
        }
      }
    }

    // init child
    else {
      const child = initChild(element, arg as SingleChild);

      if (child) {
        if (children) children.push(child);
        else children = [child];
      }
    }
  }

  return props || children
    ? new Component(element, props, children) // dynamic
    : element; // static
};

// Helpers:

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

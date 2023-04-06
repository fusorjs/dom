import {
  DynamicChild,
  Prop,
  DynamicProps,
  SingleChild,
  Config,
  Creator,
  ElementCreator,
  TaggedCreator,
} from './types';
import {initProp} from './prop';
import {initChild} from './child';
import {Component} from './component';

export class SetCreatorConfig {
  constructor(readonly config: Config) {}
}

export const create: Creator = (element, config, args) => {
  let {getPropConfig} = config;
  let props: DynamicProps | undefined;
  let children: DynamicChild<Element>[] | undefined;

  for (const arg of args) {
    // set config
    if (arg instanceof SetCreatorConfig) {
      ({getPropConfig} = arg.config);
    }

    // init props
    else if (arg?.constructor === Object) {
      for (const [_key, val] of Object.entries(arg)) {
        const {key, type} = getPropConfig(_key);
        const prop = initProp(element, key, val as Prop, type);

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
  config,
  args,
) => {
  const arg = args[0];

  let options: ElementCreationOptions | undefined;

  if (arg?.constructor === Object) {
    const {is} = arg as any;

    if (typeof is === 'string') options = {is};
  }

  const element = namespace
    ? document.createElementNS(namespace, tagName, options)
    : document.createElement(tagName, options);

  return create(element, config, args) as any;
};

export const getTaggedCreator =
  (namespace: string | undefined, config: Config) =>
  <T extends Element>(tagName: string): TaggedCreator<T> =>
  (...args) =>
    createElement(namespace, tagName, config, args) as any;

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

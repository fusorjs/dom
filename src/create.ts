import {
  DynamicChild,
  Prop,
  DynamicProps,
  SingleChild,
  Creator,
  SetCreatorConfig,
} from './types';
import {initProp} from './prop';
import {initChild} from './child';
import {Component} from './component';

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

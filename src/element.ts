import {
  StaticArg,
  Arg,
  Component,
  DynamicChild,
  Prop,
  DynamicProps,
  SingleChild,
} from './types';
import {initProp} from './prop';
import {initChild} from './child';

interface Initiator {
  <E extends Element>(elem: E, args: readonly StaticArg[]): E;
  <E extends Element>(elem: E, args: readonly Arg[]): Component<E>;
}

export interface Creator<E extends Element> {
  (...args: readonly StaticArg[]): E;
  (...args: readonly Arg[]): Component<E>;
}

export const initElement: Initiator = (element, args) => {
  let props: DynamicProps | undefined;
  let children: DynamicChild<Element>[] | undefined;

  for (const arg of args) {
    // init props
    if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        const prop = initProp(element, key, val as Prop);

        if (prop) {
          if (props) props[key] = prop;
          else props = {[key]: prop};
        }
      }
    }
    // init children
    else if (Array.isArray(arg)) {
      for (const a of arg) {
        const child = initChild(element, a as SingleChild);

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

import {
  StaticArg,
  Arg,
  Component,
  DynamicChild,
  Prop,
  Child,
  DynamicProps,
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
  // init

  let props: DynamicProps | undefined;
  let children: DynamicChild<Element>[] | undefined;

  for (const arg of args) {
    // init props
    if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        const dynamic = initProp(element, key, val as Prop);

        if (dynamic) {
          if (props) props[key] = dynamic;
          else props = {[key]: dynamic};
        }
      }
    }
    // init children
    else if (Array.isArray(arg)) {
      for (const a of arg) {
        const dynamic = initChild(element, a as Child);

        if (dynamic) {
          if (children) children.push(dynamic);
          else children = [dynamic];
        }
      }
    }
    // init child
    else {
      const updater = initChild(element, arg as Child);

      if (updater) {
        if (children) children.push(updater);
        else children = [updater];
      }
    }
  }

  return props || children
    ? new Component(element, props, children) // dynamic
    : element; // static
};

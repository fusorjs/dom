import {
  StaticArg,
  Arg,
  Component,
  ChildUpdater,
  Prop,
  Child,
  PropsUpdaters,
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

  let propUpdaters: PropsUpdaters | undefined;
  let childUpdaters: ChildUpdater<Element>[] | undefined;

  for (const arg of args) {
    // init props
    if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        const updater = initProp(element, key, val as Prop);

        if (updater) {
          if (propUpdaters) propUpdaters[key] = updater;
          else propUpdaters = {[key]: updater};
        }
      }
    }
    // init children
    else if (Array.isArray(arg)) {
      for (const a of arg) {
        const updater = initChild(element, a as Child);

        if (updater) {
          if (childUpdaters) childUpdaters.push(updater);
          else childUpdaters = [updater];
        }
      }
    }
    // init child
    else {
      const updater = initChild(element, arg as Child);

      if (updater) {
        if (childUpdaters) childUpdaters.push(updater);
        else childUpdaters = [updater];
      }
    }
  }

  return propUpdaters || childUpdaters
    ? new Component(element, propUpdaters, childUpdaters) // dynamic
    : element; // static
};

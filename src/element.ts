import {
  StaticArg,
  Arg,
  Component,
  Updater,
  ChildUpdater,
  Prop,
  Child,
} from './types';
import {initProp} from './prop';
import {initChild} from './child';

interface Initiator {
  <E extends Element>(elem: E, ...args: readonly StaticArg[]): E;
  <E extends Element>(elem: E, ...args: readonly Arg[]): Component<E>;
}

export interface Creator<E extends Element> {
  (...args: readonly StaticArg[]): E;
  (...args: readonly Arg[]): Component<E>;
}

// todo ...args -> args maybe performace?
export const initElement: Initiator = (element, ...args) => {
  // init

  let propUpdaters: Updater[] | undefined;
  let childUpdaters: ChildUpdater<Element>[] | undefined;

  for (const arg of args) {
    // init props
    if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        const updater = initProp(element, key, val as Prop);

        if (updater) {
          if (propUpdaters) propUpdaters.push(updater);
          else propUpdaters = [updater];
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

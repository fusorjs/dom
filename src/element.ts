import {isDevelopment} from '@perform/common';

import {StaticArg, Arg, Updater, Props, Child} from './types';
import {initProps} from './props';
import {initChild} from './child';

interface Initiator {
  // <E extends Element> (element: E): E;
  <E extends Element> (element: E, ...args: readonly StaticArg[]): E;
  <E extends Element> (element: E, ...args: readonly Arg[]): () => E;
}

export interface Creator {
  // (): HTMLElement;
  (...args: readonly StaticArg[]): HTMLElement;
  (...args: readonly Arg[]): () => HTMLElement;
  // (...args: readonly any[]): HTMLElement | (() => HTMLElement);
}

// export const initElement = <E extends Element, T extends readonly StaticArg[] | readonly Arg[]> (element: E, ...args: T): (T extends readonly StaticArg[] ? E : () => E) => {
export const initElement: Initiator = (element, ...args) => {
  // init
  // todo just a single array of updaters
  let propUpdaters: Updater[] | undefined;
  let childUpdaters: Updater[] | undefined;

  for (const arg of args) {
    if (arg?.constructor === Object) {
      const updaters = initProps(element, arg as Props); // todo init one by one in Object.entries

      if (updaters) {
        if (propUpdaters) propUpdaters.push(...updaters);
        else propUpdaters = updaters;
      }
    }
    else {
      const updater = initChild(element, arg as Child);
      
      if (updater) {
        if (childUpdaters) childUpdaters.push(updater);
        else childUpdaters = [updater];
      }
    }
  }

  if (! propUpdaters && ! childUpdaters) {
    // static
    return element as any;
  }
  else {
    // dynamic
    const update = () => {
      propUpdaters?.map(u => u());
      childUpdaters?.map(u => u());

      return element;
    };

    if (isDevelopment) {
      (update as any).propUpdaters = propUpdaters;
      (update as any).childUpdaters = childUpdaters;
    }

    return update as any;
  }
};

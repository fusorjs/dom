import {PropsChildren, Props, Child} from '@perform/common';

import {Updater} from './types';
import {initProps} from './props';
import {initChildren} from './children';

export const initElement = <E extends Element> (...args: [element: E, ...rest: PropsChildren]) => {
  // init
  const [element, propsOrChild] = args;

  let propUpdaters: Updater[] | undefined;
  let childUpdaters: Updater[] | undefined;

  if (args.length > 1) {
    let startIndex = 1;

    if (propsOrChild?.constructor === Object) {
      startIndex = 2;
      propUpdaters = initProps(element, propsOrChild as Props);
    }

    if (args.length > startIndex) {
      childUpdaters = initChildren(element, args as Child[], startIndex);
    }
  }

  if (! propUpdaters && ! childUpdaters) {
    // static
    return element;
  }
  else {
    // dynamic
    return () => {
      propUpdaters?.map(u => u());
      childUpdaters?.map(u => u());

      return element;
    };
  }
};

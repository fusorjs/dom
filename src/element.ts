import {PropsChildren, isDevelopment} from '@perform/common';

import {Updater} from './types';
import {initProps} from './props';
import {initChild} from './child';

export const initElement = <E extends Element> (element: E, ...propsChildren: PropsChildren) => {
  // init
  let propUpdaters: Updater[] | undefined;
  let childUpdaters: Updater[] | undefined;

  for (const propsChild of propsChildren) {
    if (propsChild?.constructor === Object) {
      const updaters = initProps(element, propsChild);

      if (updaters) {
        if (propUpdaters) propUpdaters.push(...updaters);
        else propUpdaters = updaters;
      }
    }
    else {
      const updater = initChild(element, propsChild);
      
      if (updater) {
        if (childUpdaters) childUpdaters.push(updater);
        else childUpdaters = [updater];
      }
    }
  }

  if (! propUpdaters && ! childUpdaters) {
    // static
    return element;
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

    return update;
  }
};

import {Component, KeyValObj, Child, isObject} from '@perform/common';

import {Renderer, PropUpdater, ChildUpdater} from './types';

import {initProps} from './props/init';
import {initializeChildren} from './children/initialize';

export const component: Component<Renderer> = (...args) => {
  let element: HTMLElement;
  let propUpdaters: PropUpdater[] | undefined;
  let childUpdaters: ChildUpdater[] | undefined;

  // render
  return () => {
    // ? do we need to separate: creation and updating ?

    // * All subsequent runs are just updating the rendered element:
    if (element) {
      propUpdaters?.forEach(u => u());
      childUpdaters?.forEach(u => u(element));
    }
    // * The first run must be in render, as it is actually renders the element:
    else {
      const [tagName, propsOrChild] = args;

      element = document.createElement(tagName);

      if (propsOrChild !== undefined) {
        let startIndex = 1;

        if (isObject(propsOrChild)) {
          startIndex = 2;
          propUpdaters = initProps(element, propsOrChild as KeyValObj);
        }

        if (args.length > startIndex) {
          childUpdaters = initializeChildren(element, args as Child<Renderer>[], startIndex);
        }
      }
    }

    return element;
  };
};

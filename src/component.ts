import {Component, KeyValObj, Child, isObject} from '@perform/common';

import {Renderer, PropUpdater, ChildUpdater} from './types';

import {initProps} from './prop/init';
import {initChildren} from './child/init';

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
      childUpdaters?.forEach(u => u());
    }
    // * The first run must be in render, as it is actually renders the element:
    else {
      const [tagName, propsOrChild] = args;

      element = document.createElement(tagName);

      if (propsOrChild != undefined) {
        let startIndex = 1;

        if (isObject(propsOrChild)) {
          startIndex = 2;
          propUpdaters = initProps(element, propsOrChild as KeyValObj);
        }

        if (args.length > startIndex) {
          childUpdaters = initChildren(element, args as Child<Renderer>[], startIndex);
        }
      }
    }

    return element;
  };
};

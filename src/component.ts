import {Component} from '@perform/base/types';
import {isObject} from '@perform/base/utils';

import {Renderer, PropUpdater, ChildUpdater} from './types';

import {initializeProps} from './props/initialize';
import {initializeChildren} from './children/initialize';

export const component: Component<Renderer> = (...args) => {
  let element: HTMLElement;
  let propUpdaters: PropUpdater[] | undefined;
  let childUpdaters: ChildUpdater[] | undefined;

  // render
  return () => {
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
          propUpdaters = initializeProps(element, propsOrChild);
        }

        if (args.length > startIndex) {
          childUpdaters = initializeChildren(element, args, startIndex);
        }
      }
    }

    return element;
  };
};

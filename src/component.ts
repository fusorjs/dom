import {isObject} from '@perform/base/utils';

import {DomComponent, DomPropUpdater, DomChildUpdater} from 'types';

import {initializeAttributes} from './attributes/initialize';
import {initializeChildren} from './children/initialize';

export const createComponent: DomComponent = (...args) => {
  let element: HTMLElement;
  let propUpdaters: DomPropUpdater[] | undefined;
  let childUpdaters: DomChildUpdater[] | undefined;

  // render
  return () => {
    // * All subsequent runs are just updating the rendered element:
    if (element) {
      propUpdaters?.forEach(u => u());
      childUpdaters?.forEach(u => u(element));
    }
    // * The first run must be in render, as it is actually renders the element:
    else {
      const [tagName, attributesOrChild] = args;

      element = document.createElement(tagName);

      if (attributesOrChild !== undefined) {
        let startIndex = 1;

        if (isObject(attributesOrChild)) {
          startIndex = 2;
          propUpdaters = initializeAttributes(element, attributesOrChild);
        }

        if (args.length > startIndex) {
          childUpdaters = initializeChildren(element, args, startIndex);
        }
      }
    }

    return element;
  };
};

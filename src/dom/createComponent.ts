import {isObject} from '../utils';
import {initializeAttributes} from './attributes';
import {initializeChildren} from './children';

export const createComponent: DomComponentCreator = (...args) => {
  let element: HTMLElement;
  let propUpdaters: PropUpdater[] | undefined;
  let childUpdaters: ChildUpdater[];

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
          let childNodes;

          [childNodes, childUpdaters] = initializeChildren(args, startIndex);

          if (childNodes) element.append(...childNodes);
        }
      }
    }

    return element;
  };
};

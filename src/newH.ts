import {isObject} from './utils';
import {initializeAttributes} from './dom/attributes/initializeAttributes';
import {initializeChildren} from './dom/children/initializeChildren';

interface Attributes {
  [key: string]: unknown;
}

interface Child {
}

interface PropUpdater {
  (): void;
}

interface ChildUpdater {
  (element: HTMLElement): void;
}

export const h = (...args: [tagName: string, attributesOrChild?: Attributes | Child, ...children: Child[]]) => {
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
        let index = 1;

        if (isObject(attributesOrChild)) {
          index = 2;
          propUpdaters = initializeAttributes(element, attributesOrChild);
        }

        // childUpdaters = initializeChildren(element, args, index);
      }
    }

    return element;
  };
};

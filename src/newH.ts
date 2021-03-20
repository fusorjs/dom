import {isObject} from './utils';
import {initializeAttributes} from './dom/attributes/initializeAttributes';

interface Props {
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

export const h = (...args: [tagName: string, propsOrChild?: Props | Child, ...children: Child[]]) => {
  let element: HTMLElement;
  let propUpdaters: PropUpdater[] | undefined;
  let childUpdaters: ChildUpdater[];

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
        let i = 1;

        if (isObject(propsOrChild)) {
          i = 2;
          propUpdaters = initializeAttributes(propsOrChild, element);
        }

        const nodes = [], updaters = [];

        for (const {length} = args; i < length; i ++) {
          // todo
        }
      }
    }

    return element;
  };
};

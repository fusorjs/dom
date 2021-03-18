import { isObject } from './utils';

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

export const h = (tagName: string, propsOrChild?: Props | Child, ...children: Child[]) => {
  let element: HTMLElement;
  let propUpdaters: PropUpdater[];
  let childUpdaters: ChildUpdater[];

  // Render function:
  return () => {
    // All subsequent runs are just updating the rendered element:
    if (element) {
      propUpdaters?.forEach(u => u());
      childUpdaters?.forEach(u => u(element));
    }
    // The first run must be in render, as it is actually renders the element:
    else {
      element = document.createElement(tagName);

      let i = 1;


      // [propUpdaters, childUpdaters] = setAndCompilePropsAndChildren(element, ...getPropsAndChildren(args));
    }

    return element;
  };
};




// export const div = (...a) => h('div', ...a);


import {isObject} from './utils';
import {setPropsAndGetUpdaters} from './dom/props';
import {childNodesUpdaters} from './dom/nodes';

const getPropsAndChildren = args => {
  let props, children;

  const [first] = args;

  if (first !== undefined) {
    if (isObject(first)) {
      props = first;

      if (args[1] !== undefined)
        children = args.slice(1); // todo avoid new array creation
    }
    else children = args;
  }

  return [props, children];
};

const setAndCompilePropsAndChildren = (element, props, children) => {
  let propUpdaters, childNodes, childUpdaters;

  if (props) propUpdaters = setPropsAndGetUpdaters(element, props);

  if (children) {
    [childNodes, childUpdaters] = children.reduce(childNodesUpdaters, []);
    if (childNodes) element.append(...childNodes);
  }

  return [propUpdaters, childUpdaters];
};

export const h = (tagName, ...args) => {
  let element, propUpdaters, childUpdaters;

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
      [propUpdaters, childUpdaters] = setAndCompilePropsAndChildren(element, ...getPropsAndChildren(args));
    }

    return element;
  };
};

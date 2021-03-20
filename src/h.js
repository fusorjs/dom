
import {isObject} from './utils';
import {initializeAttributes} from './dom/attributes/initializeAttributes';
import {initializeChild} from './dom/children/initializeChildren';

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
  let propUpdaters, childUpdaters;

  if (props) propUpdaters = initializeAttributes(props, element);

  // todo refactor to initializeChildren
  if (children) {
    const nodes = [], {length} = children;

    for (const child of children) {
      const updater = initializeChild(child, nodes, length);

      if (updater) {
        childUpdaters ??= [];
        childUpdaters.push(updater);
      }
    }

    element.append(...nodes);
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

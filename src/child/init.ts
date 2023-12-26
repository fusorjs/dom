import {Component} from '../component';
import {
  UpdatableChild,
  SingleChild,
  Child,
  ChildCache,
  UpdatableChildren,
} from '../types';
import {getString} from '../share';

import {convertChild, convertChildNode, emptyChild} from './share';

export const initDynamicChild = (element: Node, value: Child): ChildCache => {
  const node = convertChildNode(value);

  element.appendChild(node);

  return {
    value,
    node,
  };
};

export const initDynamicChildren = (
  element: Node,
  values: SingleChild[],
): ChildCache[] => {
  const result = [];

  for (const value of values) {
    // ! must not be skiped in dynamic child, same as for single child
    // if (v === emptyChild) continue; // ! will break range updates by index

    const evaluated = typeof value === 'function' ? value() : value;

    result.push(initDynamicChild(element, evaluated));
  }

  return result;
};

export const initChild = (
  element: Node,
  value: SingleChild,
): undefined | Component<Element> | UpdatableChild | UpdatableChildren => {
  // init static element
  if (value instanceof Element) {
    element.appendChild(value);
  }

  // init dynamic component
  else if (value instanceof Component) {
    element.appendChild(value.element);

    return value;
  }

  // init dynamic value
  else if (typeof value === 'function') {
    const evaluated = value();

    return Array.isArray(evaluated)
      ? {
          update: value,
          arrayRef: evaluated,
          cache: initDynamicChildren(element, evaluated),
        }
      : {
          update: value,
          cache: initDynamicChild(element, evaluated),
        };
  }

  // init static value
  else {
    value = convertChild(value);

    if (value === emptyChild) return; // do nothing

    element.appendChild(document.createTextNode(getString(value)));
  }
};

import {Component} from '../component';
import {getString} from '../share';
import {SingleChild, Child, ChildCache, ValueNode} from '../types';

import {convertChild} from './share';

export const initDynamicChild = (element: Node, value: Child): ChildCache => {
  let node: ValueNode | undefined;

  if (value instanceof Element) {
    node = value;
  } else if (value instanceof Component) {
    node = value.element;
  } else {
    value = getString(convertChild(value));
    node = new Text(value);
  }

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
  const result: ChildCache[] = [];

  for (const value of values) {
    // ! must not be skiped in dynamic child, same as for single child
    // if (v === emptyChild) continue; // ! will break range updates by index

    const evaluated = typeof value === 'function' ? value() : value;

    result.push(initDynamicChild(element, evaluated));
  }

  return result;
};

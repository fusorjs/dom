import {ChildCache} from '../types';
import {Component} from '../component';

import {convertChild} from './convertChild';

export const initDynamicChild = (element: Node, value: any): ChildCache => {
  let node: Node;

  if (value instanceof Node) {
    node = value;
  } else if (value instanceof Component) {
    node = value.element;
  } else {
    value = convertChild(value);
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
  values: readonly any[],
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

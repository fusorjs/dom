import {Component} from '../component';
import {UpdatableChild, UpdatableChildren} from '../types';
// import {CustomValue} from '../custom/value'; // todo

import {convertChild, emptyChild} from './convertChild';
import {initDynamicChild, initDynamicChildren} from './initDynamicChild';

export const initChild = (
  element: Element,
  value: any,
): undefined | Component<Element> | UpdatableChild | UpdatableChildren => {
  // init static element
  if (value instanceof Node) {
    element.appendChild(value);
  }

  // init dynamic component
  else if (value instanceof Component) {
    element.appendChild(value.element);

    return value;
  }

  // init static or dynamic value
  // else if (value instanceof CustomValue) {
  //   value.appendChild(element); // todo
  // }

  // init dynamic value
  else if (typeof value === 'function') {
    const evaluated = value();

    return Array.isArray(evaluated)
      ? {
          update: value,
          cache: initDynamicChildren(element, evaluated),
          terminator: element.appendChild(new Text()), // ! after appending children
          arrayRef: evaluated,
        }
      : {
          update: value,
          cache: initDynamicChild(element, evaluated),
          terminator: null,
          arrayRef: null,
        };
  }

  // init static value
  else {
    value = convertChild(value);

    if (value === emptyChild) return; // not append // ! only for static, dynamic needs node to update

    element.append(value); // append is a bit faster than appendChild https://www.measurethat.net/Benchmarks/Show/17024/0/createtextnode-vs-textcontent-vs-innertext-vs-append-vs
  }
};

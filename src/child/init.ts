import {Child} from '@perform/common';

import {ChildUpdater} from '../types';
import {getValue} from '../utils';

const getText = (val: any) => typeof val === 'object' ? JSON.stringify(val) : String(val);

const createUpdater = (callback: Function, parentNode: Node) => {
  // init
  let prevChild: Child = getValue(callback);
  let prevNode: Node;

  if (prevChild instanceof Element) {
    parentNode.appendChild(prevChild);
    prevNode = prevChild;
  }
  else {
    prevNode = document.createTextNode(getText(prevChild));
    parentNode.appendChild(prevNode);
  }

  // update
  return () => {
    const nextChild: Child = getValue(callback);

    if (nextChild === prevChild) return;

    prevChild = nextChild;

    if (nextChild instanceof Element) {
      parentNode.replaceChild(nextChild, prevNode);
      prevNode = nextChild;
    }
    else if (prevNode instanceof Text) {
      prevNode.nodeValue = getText(nextChild);
    }
    else {
      const nextNode = document.createTextNode(getText(nextChild));
      parentNode.replaceChild(nextNode, prevNode);
      prevNode = nextNode;
    }
  };
};

export const initChildren = (parent: Element, children: readonly Child[], startIndex = 0) => {
  let updaters: ChildUpdater[] | undefined, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    const child = children[index];

    // dynamic
    if (typeof child === 'function') {
      updaters ??= [];
      updaters.push(createUpdater(child, parent));
    }
    // static
    else {
      parent.append(getText(child));
      // do not optimize by concatenating serial static values to a single node
      // it should be done by the client code in upper scope
    }
  }

  return updaters;
};

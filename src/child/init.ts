import {Child} from '@perform/common';

import {Component, Updater} from '../types';
import {getValue} from '../utils';

// pure inline
const getText = (val: any) => typeof val === 'object' ? JSON.stringify(val) : String(val);

const createUpdater = (callback: Function, parentNode: Node) => {
  // init
  let child: Child = getValue(callback);
  let node: Node;

  if (child instanceof Component) {
    const {element} = child;

    parentNode.appendChild(element);
    node = element;
  }
  else {
    node = document.createTextNode(getText(child));
    parentNode.appendChild(node);
  }

  // update
  return () => {
    const nextChild: Child = getValue(callback);

    if (nextChild === child) {
      if (child instanceof Component) child.update?.();

      return;
    };

    child = nextChild;

    if (nextChild instanceof Component) {
      const {element} = nextChild;

      parentNode.replaceChild(element, node);
      node = element;
    }
    else if (node instanceof Text) {
      node.nodeValue = getText(nextChild);
    }
    else {
      const nextNode = document.createTextNode(getText(nextChild));
      parentNode.replaceChild(nextNode, node);
      node = nextNode;
    }
  };
};

export const initChildren = (parent: Element, children: readonly Child[], index = 0) => {
  let updaters: Updater[] | undefined;

  for (const {length} = children; index < length; index ++) {
    const child = children[index];

    // component
    if (child instanceof Component) {
      const {element, update} = child;

      parent.append(element);

      if (update) {
        updaters ??= [];
        updaters.push(update);
      }
    }
    // dynamic
    else if (typeof child === 'function') {
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

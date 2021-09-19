import {Child, Evaluable, evaluate, getChildString} from '@perform/common';

import {Updater} from './types';

const createUpdater = (callback: Evaluable<Child>, parentNode: Node) => {
  // init
  let child: Child = '';
  let node: Node = document.createTextNode('');

  parentNode.appendChild(node);

  // update
  return () => {
    const nextChild: Child = evaluate(callback);

    if (nextChild === child) return;

    child = nextChild;

    if (nextChild instanceof Element) {
      parentNode.replaceChild(nextChild, node);
      node = nextChild;
    }
    else if (node instanceof Text) {
      node.nodeValue = getChildString(nextChild);
    }
    else {
      const nextNode = document.createTextNode(getChildString(nextChild));
      parentNode.replaceChild(nextNode, node);
      node = nextNode;
    }
  };
};

export const initChildren = (parent: Element, children: readonly Child[], index = 0) => {
  let updaters: Updater[] | undefined;

  for (const {length} = children; index < length; index ++) {
    const child = children[index];

    // dynamic
    if (typeof child === 'function') {
      updaters ??= [];
      updaters.push(createUpdater(child, parent));
    }
    // static
    else if (child instanceof Element) {
      parent.append(child);
    }
    else {
      parent.append(getChildString(child));
      // do not optimize by concatenating serial static values to a single node
      // it should be done by the client code in upper scope
    }
  }

  return updaters;
};

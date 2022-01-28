import {Evaluable, evaluate, getString} from '@perform/common';

import {Child, Updater, elementSymbol} from './types';

// todo class
const createUpdater = (callback: Evaluable<Child>, parentNode: Node): Updater => {
  // init

  let prevValue = evaluate(callback);

  let prevNode = prevValue instanceof Element
    ? prevValue
    : document.createTextNode(getString(prevValue));

  parentNode.appendChild(prevNode);

  // update
  return () => {
    const nextValue = evaluate(callback);

    if (nextValue === prevValue) return;

    prevValue = nextValue;

    if (nextValue instanceof Element) {
      parentNode.replaceChild(nextValue, prevNode);
      prevNode = nextValue;
    }
    else if (prevNode instanceof Text) {
      prevNode.nodeValue = getString(nextValue);
    }
    else {
      const nextNode = document.createTextNode(getString(nextValue));
      parentNode.replaceChild(nextNode, prevNode);
      prevNode = nextNode;
    }
  };
};

export const initChild = (parent: Element, value: Child) => {
  // dynamic
  if (typeof value === 'function') {
    if (elementSymbol in value) {
      parent.append((value as any)[elementSymbol]);
      return value as Updater;
    }
    else return createUpdater(value as Evaluable<Child>, parent);
  }
  // static
  else if (value instanceof Element) {
    parent.append(value);
  }
  else {
    parent.append(getString(value));
    // do not optimize by concatenating serial static values to a single node
    // it should be done by the client code in upper scope
  }
};

import {Child, Updater, Component} from './types';
import {Evaluable, evaluate, getString} from './utils';

const createUpdater = (
  callback: Evaluable<Child>,
  parentNode: Node,
): Updater => {
  // init

  let prevValue = evaluate(callback);

  let prevNode: Element | Text;

  if (prevValue instanceof Element) {
    prevNode = prevValue;
  } else if (prevValue instanceof Component) {
    prevNode = prevValue.getElement();
  } else {
    prevNode = document.createTextNode(getString(prevValue));
  }

  parentNode.appendChild(prevNode);

  // update // todo class
  return () => {
    const nextValue = evaluate(callback);

    if (nextValue === prevValue) return;

    prevValue = nextValue;

    // todo optimize branch order:

    // replace with different element
    if (nextValue instanceof Element) {
      parentNode.replaceChild(nextValue, prevNode);
      prevNode = nextValue;
    }
    // replace with different component's element
    else if (nextValue instanceof Component) {
      const elm = nextValue.getElement();

      parentNode.replaceChild(elm, prevNode);
      prevNode = elm;
    }
    // replace text within the same text node
    else if (prevNode instanceof Text) {
      prevNode.nodeValue = getString(nextValue);
    }
    // replace element with text node
    else {
      const nextNode = document.createTextNode(getString(nextValue));

      parentNode.replaceChild(nextNode, prevNode);
      prevNode = nextNode;
    }
  };
};

export const initChild = (parent: Element, value: Child) => {
  // todo optimize branch order:

  // dynamic component
  if (value instanceof Component) {
    parent.append(value.getElement());

    return value;
  }
  // dynamic updater
  else if (typeof value === 'function') {
    return createUpdater(value as Evaluable<Child>, parent);
  }
  // static element
  else if (value instanceof Element) {
    parent.append(value);
  }
  // static value
  else {
    parent.append(getString(value));
    // do not optimize by concatenating serial static values to a single node
    // it should be done by the client code in upper scope
  }
};

import {StaticChild, Child, Component, Evaluable, ChildData} from './types';
import {evaluate, getString} from './utils';

export const emptyChild = '';

export const convertChild = (value: any) => {
  switch (value) {
    case null:
    case undefined:
    case emptyChild:
      return emptyChild;
    default:
      return value;
  }
};

export const getChildNode = (value: any): Element | Text => {
  if (value instanceof Element) {
    return value;
  } else if (value instanceof Component) {
    return value.getElement();
  } else {
    return document.createTextNode(getString(value));
  }
};

export const initChild = (parent: Node, value: Child) => {
  value = convertChild(value);

  // do nothing
  if (value === emptyChild) {
    return;
  }
  // static element
  else if (value instanceof Element) {
    parent.appendChild(value);
  }
  // dynamic component
  else if (value instanceof Component) {
    parent.appendChild(value.getElement());

    return value;
  }
  // dynamic updater
  else if (typeof value === 'function') {
    const val = convertChild(evaluate(value as Evaluable<StaticChild>));
    const node = getChildNode(val);

    parent.appendChild(node);

    const data: ChildData = {
      update: value as Evaluable<StaticChild>,
      value: val,
      node: node,
    };

    return data;
  }
  // static value
  else {
    parent.appendChild(document.createTextNode(getString(value)));
    // do not optimize by concatenating serial static values to a single node
    // it should be done by the client code in upper scope
  }
};

export const updateChild = (parent: Node, data: ChildData) => {
  const value = convertChild(evaluate(data.update));

  if (value === data.value) return;

  data.value = value;

  // replace with different element
  if (value instanceof Element) {
    parent.replaceChild(value, data.node);
    data.node = value;
  }
  // replace with different component's element
  else if (value instanceof Component) {
    const element = value.getElement();

    parent.replaceChild(element, data.node);
    data.node = element;
  }
  // replace text reusing node
  else if (data.node instanceof Text) {
    data.node.nodeValue = getString(value);
  }
  // replace text creating node
  else {
    const node = document.createTextNode(getString(value));

    parent.replaceChild(node, data.node);
    data.node = node;
  }
};

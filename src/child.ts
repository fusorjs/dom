import {
  StaticChild,
  Component,
  Evaluable,
  UpdatableChild,
  ValueNode,
  SingleChild,
} from './types';
import {evaluate, getString, ObjectIs} from './utils';

export const emptyChild = '';

export const convertChild = <T>(value: T): T | typeof emptyChild => {
  switch (value) {
    case null:
    case undefined:
    case emptyChild as any:
      return emptyChild;
    default:
      return value;
  }
};

export const getChildNode = (value: any): ValueNode => {
  if (value instanceof Element) {
    return value;
  } else if (value instanceof Component) {
    return value.getElement();
  } else {
    return document.createTextNode(getString(value));
  }
};

export const initDynamicChild = (
  parent: Node,
  update: Evaluable<StaticChild>,
): UpdatableChild => {
  const value = evaluate(update);
  let node: ValueNode | ValueNode[];

  // init dynamic array
  if (Array.isArray(value)) {
    node = [];

    for (let v of value) {
      v = convertChild(v);

      if (v === emptyChild) continue;

      const n = getChildNode(v);

      parent.appendChild(n);
      node.push(n);
    }

    return {
      update,
      value,
      node,
    };
  }

  // init dynamic value
  else {
    const v = convertChild(value);

    node = getChildNode(v);

    parent.appendChild(node);

    return {
      update,
      value,
      node,
    };
  }
};

export const initChild = (parent: Node, value: SingleChild) => {
  // init static element
  if (value instanceof Element) {
    parent.appendChild(value);
  }

  // init dynamic component
  else if (value instanceof Component) {
    parent.appendChild(value.getElement());

    return value;
  }

  // init dynamic value
  else if (typeof value === 'function') {
    return initDynamicChild(parent, value as Evaluable<StaticChild>);
  }

  // init static value
  else {
    value = convertChild(value);

    if (value === emptyChild) return; // do nothing

    parent.appendChild(document.createTextNode(getString(value)));
  }
};

export const convertChildNode = <T>(value: T) =>
  getChildNode(convertChild(value));

export const updateChild = (parent: Node, updatable: UpdatableChild) => {
  const {update, value: prevValue, node: prevNode} = updatable;
  const nextValue = evaluate(update);

  if (ObjectIs(nextValue, prevValue)) return;

  updatable.value = nextValue;

  const isNextArray = Array.isArray(nextValue);
  const isPrevArray = Array.isArray(prevValue);

  // -- MULTIPLE --

  // replace children with children
  if (isNextArray && isPrevArray) {
    const nextNode = nextValue.map(convertChildNode);

    updatable.node = nextNode;

    // todo range, maybe diff
    (parent as any).replaceChildren(...nextNode);
  }

  // replace child with children
  else if (isNextArray) {
    const nextNode = nextValue.map(convertChildNode);

    updatable.node = nextNode;

    // todo range
    (parent as any).replaceChildren(...nextNode);
  }

  // replace children with child
  else if (isPrevArray) {
    const nextNode = convertChildNode(nextValue);

    updatable.node = nextNode;

    // todo range
    (parent as any).replaceChildren(nextNode);
  }

  // -- SINGLE --

  // replace with different element
  else if (nextValue instanceof Element) {
    updatable.node = nextValue;

    parent.replaceChild(nextValue, prevNode as ValueNode);
  }

  // replace with different component's element
  else if (nextValue instanceof Component) {
    const nextNode = nextValue.getElement();

    updatable.node = nextNode;

    parent.replaceChild(nextNode, prevNode as ValueNode);
  }

  // replace text reusing node
  else if (prevNode instanceof Text) {
    prevNode.nodeValue = getString(convertChild(nextValue));
  }

  // replace text creating node
  else {
    const nextNode = document.createTextNode(
      getString(convertChild(nextValue)),
    );

    updatable.node = nextNode;

    parent.replaceChild(nextNode, prevNode as ValueNode);
  }
};

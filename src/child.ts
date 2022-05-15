import {
  StaticChild,
  Component,
  Evaluable,
  Evaluated,
  UpdatableChild,
  ValueNode,
  ChildCache,
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

/** @deprecated */
export const getChildCache = (value: any): ChildCache => {
  const converted = convertChild(value);

  return {
    value: converted,
    node: getChildNode(converted),
  };
};

export const initDynamicChild = (
  parent: Node,
  update: Evaluable<StaticChild>,
): UpdatableChild => {
  const result = evaluate(update);
  let cache: ChildCache | ChildCache[];

  // init dynamic array
  if (Array.isArray(result)) {
    cache = [];

    for (let value of result) {
      value = convertChild(value);

      if (value === emptyChild) continue;

      const node = getChildNode(value);

      parent.appendChild(node);
      cache.push({value, node});
    }
  }
  // init dynamic value
  else {
    const value = convertChild(result);
    const node = getChildNode(value);

    parent.appendChild(node);
    cache = {value, node};
  }

  return {
    update,
    cache,
  };
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
    // do not optimize by concatenating serial static values to a single node
    // it should be done by the client code in upper scope
  }
};

export const updateSingleChild = (
  parent: Node,
  value: Evaluated<SingleChild>,
  cache: ChildCache,
) => {
  // if (value === cache.value) return;
  if (ObjectIs(value, cache.value)) return;

  cache.value = value;

  // replace with different element
  if (value instanceof Element) {
    parent.replaceChild(value, cache.node);
    cache.node = value;
  }
  // replace with different component's element
  else if (value instanceof Component) {
    const element = value.getElement();

    parent.replaceChild(element, cache.node);
    cache.node = element;
  }
  // replace text reusing node
  else if (cache.node instanceof Text) {
    cache.node.nodeValue = getString(value);
  }
  // replace text creating node
  else {
    const node = document.createTextNode(getString(value));

    parent.replaceChild(node, cache.node);
    cache.node = node;
  }
};

const getNode = ({node}: ChildCache) => node;

export const updateChild = (parent: Node, updatable: UpdatableChild) => {
  const {update, cache} = updatable;
  const value = evaluate(update);
  const isValueArray = Array.isArray(value);
  const isCacheArray = Array.isArray(cache);

  // update children with children
  if (isValueArray && isCacheArray) {
    const cache = value.map(getChildCache);

    updatable.cache = cache;

    // todo range, maybe diff
    (parent as any).replaceChildren(...cache.map(getNode));
  }
  // update child with children
  else if (isValueArray) {
    const cache = value.map(getChildCache);

    updatable.cache = cache;

    // todo range
    (parent as any).replaceChildren(...cache.map(getNode));
  }
  // update children with child
  else if (isCacheArray) {
    const v = convertChild(value);
    const n = getChildNode(v);

    updatable.cache = {
      value: v,
      node: n,
    };

    // todo range
    (parent as any).replaceChildren(n);
  }
  // update child with child
  else {
    updateSingleChild(parent, convertChild(value), cache);
  }
};

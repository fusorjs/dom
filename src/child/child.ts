import {Component} from '../component';
import {
  UpdatableChild,
  ValueNode,
  SingleChild,
  Child,
  ChildCache,
  UpdatableChildren,
} from '../types';
import {getString, ObjectIs} from '../share';

export const emptyChild = '';

export const convertChild = (value: any) => {
  switch (value) {
    case null:
    case true:
    case false:
    case undefined:
      return emptyChild;
  }

  return value;
};

export const getChildNode = (value: any): ValueNode => {
  if (value instanceof Element) {
    return value;
  } else if (value instanceof Component) {
    return value.element;
  } else {
    return document.createTextNode(getString(value));
  }
};

export const convertChildNode = (value: any): ValueNode => {
  return getChildNode(convertChild(value));
};

export const initDynamicChild = (element: Node, value: Child): ChildCache => {
  const node = convertChildNode(value);

  element.appendChild(node);

  return {
    value,
    node,
  };
};

export const initDynamicChildren = (
  element: Node,
  values: SingleChild[],
): ChildCache[] => {
  const result = [];

  for (const value of values) {
    // ! must not be skiped in dynamic child, same as for single child
    // if (v === emptyChild) continue; // ! will break range updates by index

    const evaluated = typeof value === 'function' ? value() : value;

    result.push(initDynamicChild(element, evaluated));
  }

  return result;
};

export const initChild = (
  element: Node,
  value: SingleChild,
): undefined | Component<Element> | UpdatableChild | UpdatableChildren => {
  // init static element
  if (value instanceof Element) {
    element.appendChild(value);
  }

  // init dynamic component
  else if (value instanceof Component) {
    element.appendChild(value.element);

    return value;
  }

  // init dynamic value
  else if (typeof value === 'function') {
    const evaluated = value();

    return Array.isArray(evaluated)
      ? {
          update: value,
          arrayRef: evaluated,
          cache: initDynamicChildren(element, evaluated),
        }
      : {
          update: value,
          cache: initDynamicChild(element, evaluated),
        };
  }

  // init static value
  else {
    value = convertChild(value);

    if (value === emptyChild) return; // do nothing

    element.appendChild(document.createTextNode(getString(value)));
  }
};

export const updateChildCache = (value: SingleChild): ChildCache => {
  const evaluated = typeof value === 'function' ? value() : value;

  return {
    value: evaluated,
    node: convertChildNode(evaluated),
  };
};

export const getNode = ({node}: ChildCache) => node;

export const updateChild = (
  element: Node,
  updatable: UpdatableChild | UpdatableChildren,
): void => {
  const {update, cache} = updatable;
  const nextValue = update();

  const isNextArray = Array.isArray(nextValue);
  const isPrevArray = Array.isArray(cache);

  // -- MULTIPLE --

  // replace children with children
  if (isNextArray && isPrevArray) {
    if ((updatable as UpdatableChildren).arrayRef === nextValue) return;

    (updatable as UpdatableChildren).arrayRef = nextValue;

    const cache = nextValue.map(updateChildCache);

    updatable.cache = cache;

    // todo range, maybe diff
    (element as any).replaceChildren(...cache.map(getNode));
  }

  // replace child with children
  else if (isNextArray) {
    (updatable as UpdatableChildren).arrayRef = nextValue;

    const cache = nextValue.map(updateChildCache);

    updatable.cache = cache;

    // todo range
    (element as any).replaceChildren(...cache.map(getNode));
  }

  // replace children with child
  else if (isPrevArray) {
    delete (updatable as Partial<Pick<UpdatableChildren, 'arrayRef'>>).arrayRef;

    const node = convertChildNode(nextValue);

    updatable.cache = {
      value: nextValue,
      node,
    };

    // todo range
    (element as any).replaceChildren(node);
  }

  // -- SINGLE --
  else {
    const {value: prevValue, node: prevNode} = cache;

    // same value do nothing
    if (ObjectIs(nextValue, prevValue)) return;

    updatable.cache = {
      value: nextValue,
      node: updateSingleChild(element, prevNode, nextValue),
    };
  }
};

/** @returns nextNode */
export const updateSingleChild = (
  element: Node,
  prevNode: ValueNode,
  nextValue: SingleChild | Component<Element>,
): ValueNode => {
  // replace with different element
  if (nextValue instanceof Element) {
    element.replaceChild(nextValue, prevNode as ValueNode);

    return nextValue;
  }

  // replace with different component's element
  else if (nextValue instanceof Component) {
    const nextNode = nextValue.element;

    element.replaceChild(nextNode, prevNode as ValueNode);

    return nextNode;
  }

  // replace text reusing node
  else if (prevNode instanceof Text) {
    prevNode.nodeValue = getString(convertChild(nextValue));

    return prevNode;
  }

  // replace text creating node
  else {
    const nextNode = document.createTextNode(
      getString(convertChild(nextValue)),
    );

    element.replaceChild(nextNode, prevNode as ValueNode);

    return nextNode;
  }
};

// quickArrayDiff(
//   prevNode as ValueNode[],
//   nextNode as ValueNode[],
//   // compare
//   (index, prevNode, nextNode) => {
//     if (prevNode !== nextNode) parent.replaceChild(nextNode, prevNode);
//   },
//   // append
//   (index, nextNode) => {
//     parent.appendChild(nextNode);
//   },
//   // remove
//   (index, prevNode) => {
//     parent.removeChild(prevNode);
//   },
// );

// (index, prevValue, nextValue) => {
//   if (typeof nextValue === 'function') {
//     nextValue = evaluate(nextValue as Evaluable<SingleChild>);
//   }
//   if (ObjectIs(nextValue, prevValue)) {
//     if (nextValue instanceof Component) nextValue.update(recursion - 1);
//     nextNode.push((prevNode as ValueNode[])[index]);
//   } else {
//     nextNode.push(
//       updateSingleChild(
//         parent,
//         (prevNode as ValueNode[])[index],
//         nextValue,
//         recursion,
//       ),
//     );
//   }
// }

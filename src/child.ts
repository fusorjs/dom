import {Component, RECURSION_LIMIT} from './element';
import {
  Evaluable,
  UpdatableChild,
  ValueNode,
  SingleChild,
  Child,
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
    return value.element;
  } else {
    return document.createTextNode(getString(value));
  }
};

export const initDynamicChild = (
  parent: Node,
  update: Evaluable<Child>,
): UpdatableChild => {
  const value = evaluate(update);
  let node: ValueNode | ValueNode[];

  // init dynamic array
  if (Array.isArray(value)) {
    node = [];

    const vals = [];

    for (const item of value) {
      let v = typeof item === 'function' ? evaluate(item) : item;

      vals.push(v);

      v = convertChild(v);

      // ! must not be skiped in dynamic child, same as for single child
      // if (v === emptyChild) continue; // ! will break updates by index

      const n = getChildNode(v);

      parent.appendChild(n);
      node.push(n);
    }

    return {
      update,
      refValue: value,
      value: vals,
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
    parent.appendChild(value.element);

    return value;
  }

  // init dynamic value
  else if (typeof value === 'function') {
    return initDynamicChild(parent, value);
  }

  // init static value
  else {
    value = convertChild(value);

    if (value === emptyChild) return; // do nothing

    parent.appendChild(document.createTextNode(getString(value)));
  }
};

// /** @returns nextNode */
// export const updateSingleChild = (
//   parent: Node,
//   prevNode: ValueNode,
//   nextValue: SingleStaticChild | Component<Element>,
//   recursion: number,
// ): ValueNode => {
//   // replace with different element
//   if (nextValue instanceof Element) {
//     parent.replaceChild(nextValue, prevNode as ValueNode);

//     return nextValue;
//   }

//   // replace with different component's element
//   else if (nextValue instanceof Component) {
//     nextValue.update(recursion - 1);

//     const nextNode = nextValue.getElement();

//     parent.replaceChild(nextNode, prevNode as ValueNode);

//     return nextNode;
//   }

//   // replace text reusing node
//   else if (prevNode instanceof Text) {
//     prevNode.nodeValue = getString(convertChild(nextValue));

//     return prevNode;
//   }

//   // replace text creating node
//   else {
//     const nextNode = document.createTextNode(
//       getString(convertChild(nextValue)),
//     );

//     parent.replaceChild(nextNode, prevNode as ValueNode);

//     return nextNode;
//   }
// };

export const updateEvaluateChild = (value: SingleChild) => {
  const v = typeof value === 'function' ? evaluate(value) : value;

  if (v instanceof Component) v.update();

  return v;
};

export const convertChildNode = <T>(value: T) =>
  getChildNode(convertChild(value));

export const updateChild = (
  parent: Node,
  updatable: UpdatableChild,
  recursion = RECURSION_LIMIT,
) => {
  const {update, value: prevValue, node: prevNode} = updatable;
  const nextValue = evaluate(update);

  // same value
  if (ObjectIs(nextValue, prevValue)) {
    if (nextValue instanceof Component) nextValue.update(recursion - 1);

    return; // do nothing
  }

  updatable.value = nextValue;

  const isNextArray = Array.isArray(nextValue);
  const isPrevArray = Array.isArray(prevValue);

  // -- MULTIPLE --

  // replace children with children
  if (isNextArray && isPrevArray) {
    if ((updatable as any).refValue === nextValue) return;

    (updatable as any).refValue = nextValue;

    const _nextValue = nextValue.map(updateEvaluateChild);

    updatable.value = _nextValue;

    const nextNode = _nextValue.map(convertChildNode);

    updatable.node = nextNode;

    // todo range, maybe diff
    (parent as any).replaceChildren(...nextNode);
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
  }

  // replace child with children
  else if (isNextArray) {
    (updatable as any).refValue = nextValue;

    const _nextValue = nextValue.map(updateEvaluateChild);

    updatable.value = _nextValue;

    const nextNode = _nextValue.map(convertChildNode);

    updatable.node = nextNode;

    // todo range
    (parent as any).replaceChildren(...nextNode);
  }

  // replace children with child
  else if (isPrevArray) {
    (updatable as any).refValue = undefined;

    if (nextValue instanceof Component) nextValue.update(recursion - 1);

    const nextNode = convertChildNode(nextValue);

    updatable.node = nextNode;

    // todo range
    (parent as any).replaceChildren(nextNode);
  }

  // -- SINGLE -- // todo refactor with updateSingleChild

  // replace with different element
  else if (nextValue instanceof Element) {
    updatable.node = nextValue;

    parent.replaceChild(nextValue, prevNode as ValueNode);
  }

  // replace with different component's element
  else if (nextValue instanceof Component) {
    nextValue.update(recursion - 1);

    const nextNode = nextValue.element;

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

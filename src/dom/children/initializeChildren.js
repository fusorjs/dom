import {isFunction, isArray} from '../../utils';

import {updateChildren} from './updateChildren';

const isDefiniteValue = v => {
  const t = typeof v;
  return t === 'string' || t === 'number';
};

const createChildUpdater = (node, f, prev) => () => {
  let v = f();

  if (v && isFunction(v)) v = v();

  if (prev === v) return;
  else prev = v;

  if (v instanceof HTMLElement);
  else if (isDefiniteValue(v)) {
    if (node instanceof Text) {
      node.nodeValue = v;
      return;
    }
    v = document.createTextNode(v);
  }
  else throw new Error(`unsupported child: ${f}`);

  node.replaceWith(v);

  node = v;
};

const createChildrenUpdater = (getNextChildren, prevChildren, prevNodes) => parentNode => {
  const nextChildren = getNextChildren();

  if (prevChildren === nextChildren) return;

  const nextNodes = [];

  for (const child of nextChildren) {
    // ? ignore returned updater
    initializeChild(child, nextNodes); // ! no length
  }

  updateChildren(parentNode, prevNodes, nextNodes);

  prevChildren = nextChildren;
  prevNodes = nextNodes;
};

export function initializeChild(v, nodes, length) {
  let updater;

  if (v && isFunction(v)) {
    const f = v;
    v = v();

    if (v instanceof HTMLElement) updater = f;
    else {
      let prev = v;

      if (v && isFunction(v)) v = prev = v(); // conditions

      if (v instanceof HTMLElement);
      else if (isDefiniteValue(v)) v = document.createTextNode(v);
      else if (v && isArray(v) && length === 1) { // * array, single child
        for (const child of v) {
          // ? ignore returned updater
          initializeChild(child, nodes); // ! no length
        }

        return createChildrenUpdater(f, v, nodes); // ! exit early
      }
      else throw new Error(`unsupported child: ${f}`);

      updater = createChildUpdater(v, f, prev);
    }
  }

  nodes.push(v);

  return updater;
};

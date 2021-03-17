import {isFunction, isArray} from '../utils';

import {updateChildren} from './node/updateChildren';

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

const createChildrenUpdater = (f, prevNodes) => parentNode => {
  const [nextNodes] = f();

  if (prevNodes === nextNodes) return;

  updateChildren(parentNode, prevNodes, nextNodes);

  prevNodes = nextNodes;
};

export const childNodesUpdaters = ([nodes, updaters], v, _index, children) => {
  if (v && isFunction(v)) {
    const f = v;
    v = v();
    updaters ??= [];

    if (v instanceof HTMLElement) updaters.push(f);
    else {
      let prev = v;

      if (v && isFunction(v)) v = prev = v(); // conditions

      if (v instanceof HTMLElement);
      else if (isDefiniteValue(v)) v = document.createTextNode(v);
      else if (v && isArray(v) && children.length === 1) { // todo array, single child for now
        const [nodes] = v.reduce(childNodesUpdaters, []);
        return [
          nodes,
          [
            // e => {
            //   const [nodes] = f().reduce(childNodesUpdaters, []);
            //   e.replaceChildren(...nodes);
            // }
            // todo replace only diff
            createChildrenUpdater(
              () => f().reduce(childNodesUpdaters, []),
              nodes
            )
          ]
        ];
      }
      else throw new Error(`unsupported child: ${f}`);

      updaters.push(createChildUpdater(v, f, prev));
    }
  }

  nodes ??= [];
  nodes.push(v);

  return [nodes, updaters];
};

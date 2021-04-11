import {isFunction, isArray} from '../../helpers/utils';

import {updateNodes} from './update/nodes';

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

const createChildrenUpdater = (prevNodes, getNextNodes) => (parentNode) => {
  const nextNodes = getNextNodes();

  if (prevNodes === nextNodes) return;

  updateNodes(parentNode, prevNodes, nextNodes);

  prevNodes = nextNodes;
};


const CHILDREN_UPDATER_KEY = '__PERFORM_CHILDREN_UPDATER';
export const childrenUpdater = (f) => {f[CHILDREN_UPDATER_KEY] = true; return f;};
export const isChildrenUpdater = (f) => f[CHILDREN_UPDATER_KEY] === true;

export const initializeChildren = (children, startIndex = 0) => {
  let nodes, updaters, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    let v = children[index];

    if (v && isFunction(v)) {
      const f = v;

      v = v();

      if (v instanceof HTMLElement) {
        updaters ??= [];
        updaters.push(f);
      }
      else {
        let prev = v;

        if (v && isFunction(v)) v = prev = v(); // condition

        if (v instanceof HTMLElement);
        else if (isDefiniteValue(v)) v = document.createTextNode(v);
        else if (v && isArray(v)) { // array
          if ((length - startIndex) !== 1) throw new Error(`not a single child: ${f}`);

          const [nodes] = initializeChildren(v);

          return [
            nodes,
            // updaters
            [createChildrenUpdater(nodes, () => initializeChildren(f())[0])]
          ];
        }
        else throw new Error(`unsupported child: ${f}`);

        updaters ??= [];
        updaters.push(createChildUpdater(v, f, prev));
      }
    }

    nodes ??= [];
    nodes.push(v);
  }

  return [nodes, updaters];
};

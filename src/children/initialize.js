import {isFunction, isArray, isLiteral} from '@perform/base/utils';

import {isCustomUpdater} from './updater/custom';
// import {updateNodes} from './update/nodes';

const createChildUpdater = (node, f, prev) => () => {
  let v = f();

  if (v && isFunction(v)) v = v();

  if (prev === v) return;
  else prev = v;

  if (v instanceof HTMLElement);
  else if (isLiteral(v)) {
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

// const createChildrenUpdater = (prevNodes, getNextNodes) => (parentNode) => {
//   const nextNodes = getNextNodes();

//   if (prevNodes === nextNodes) return;

//   updateNodes(parentNode, prevNodes, nextNodes);

//   prevNodes = nextNodes;
// };

export const initializeChildren = (parentNode, children, startIndex = 0) => {
  let updaters, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    let v = children[index];

    if (! v) throw new Error(`unsupported child: ${v}`);
    else if (isFunction(v)) {
      const f = v;

      if (isCustomUpdater(f)) {
        if ((length - startIndex) !== 1) throw new Error(`not a single child: ${f}`);
        f(parentNode);
        return [f];
      }

      v = v(); // renderer, condition

      if (v instanceof HTMLElement) {
        updaters ??= [];
        updaters.push(f);
      }
      else {
        let prev = v;

        if (v && isFunction(v)) v = prev = v(); // condition renderer, child array

        if (v instanceof HTMLElement);
        else if (isLiteral(v)) v = document.createTextNode(v);
        // else if (v && isArray(v)) { // array
        //   if ((length - startIndex) !== 1) throw new Error(`not a single child: ${f}`);

        //   const [nodes] = initializeChildren(v);

        //   return [
        //     nodes,
        //     // updaters
        //     [createChildrenUpdater(nodes, () => initializeChildren(f())[0])]
        //   ];
        // }
        else throw new Error(`unsupported child: ${f}`);

        updaters ??= [];
        updaters.push(createChildUpdater(v, f, prev));
      }
    }
    else if (v instanceof HTMLElement);
    else if (isLiteral(v));
    else throw new Error(`unsupported child: ${v}`);

    parentNode.append(v);
  }

  return updaters;
};

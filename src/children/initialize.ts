import {isFunction, isArray, isLiteral} from '@perform/base/utils';

import {Child} from '../types';
import {isCustomUpdater} from './updater/custom';
// import {updateNodes} from './update/nodes';

const createChildUpdater = (node: Element, f: () => any, prev: any) => () => {
  let v = f();

  if (v && isFunction(v)) v = v();

  if (prev === v) return;
  else prev = v;

  if (v instanceof HTMLElement) {}
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

// const initChild = (parentNode: Element, v: Child, index: number) => {
//   let updaters;
// };
// const updater = initChild(parentNode, children[index], length - startIndex);

export const initializeChildren = (
  parentNode: Element, children: Child[], startIndex = 0, recursive = false
) => {
  let updaters, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    let v = children[index];

    if (! v) {
      throw new Error(`unsupported child: ${v}`);
    }
    else if (v instanceof HTMLElement || isLiteral(v)) {
      parentNode.append(v);
    }
    else if (isArray(v)) {
      if (recursive) throw new Error(`recursive child: ${v}`);
      if ((length - startIndex) !== 1) throw new Error(`not a single child: ${v}`);
      initializeChildren(parentNode, v, undefined, true);
      break;
    }
    else if (isCustomUpdater(v)) { // before isFunction
      if (recursive) throw new Error(`recursive child: ${v}`);
      if ((length - startIndex) !== 1) throw new Error(`not a single child: ${v}`);
      v(parentNode);
      updaters = [v];
      break;
    }
    else if (isFunction(v)) { // todo refactor to recursive call

      const f = v;

      v = v(); // renderer, condition

      if (v instanceof HTMLElement) {
        updaters ??= [];
        updaters.push(f);
      }
      else {
        let prev = v;

        if (v && isFunction(v)) v = prev = v(); // condition renderer, child array

        if (v instanceof HTMLElement) {}
        else if (isLiteral(v)) v = document.createTextNode(v);
        else if (v && isArray(v)) {
          if (recursive) throw new Error(`recursive child: ${v}`);
          if ((length - startIndex) !== 1) throw new Error(`not a single child: ${f}`);
          initializeChildren(parentNode, v, undefined, true);
          updaters = [() => {
            (parentNode as any).replaceChildren(); // todo remove "as any"
            initializeChildren(parentNode, f(), undefined, true);
          }]
          break;
        }
        else throw new Error(`unsupported child: ${f}`);

        updaters ??= [];
        updaters.push(createChildUpdater(v, f, prev));
      }

      parentNode.append(v);
    }
    else {
      throw new Error(`unsupported child: ${v}`);
    }
  }

  return updaters;
};

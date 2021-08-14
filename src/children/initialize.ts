import {TagPropsChildren, isArray, isFunction, isLiteral} from '@perform/common';

import {Renderer, ChildUpdater} from '../types';
import {isCustomUpdater} from './updater/custom';
// import {updateNodes} from './update/nodes';

// const isHidden = (v: unknown) =>
//   v === false || v === null || v === undefined || v === true;

const createChildUpdater = (node: Element, f: Function, prev: any) => () => {
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

// todo refactor this function
export const initializeChildren = (
  parentNode: HTMLElement, children: TagPropsChildren<Renderer>, startIndex = 0, recursive = false
) => {
  let updaters: ChildUpdater[] | undefined, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    let v = children[index];

    if (! v) {
      throw new Error(`unsupported child: ${v}`);
    }
    // else if (v instanceof HTMLElement) { // is not a Child
    //   parentNode.append(v as HTMLElement);
    // }
    else if (isLiteral(v)) {
      parentNode.append(v as string);
    }
    else if (isArray(v)) {
      if (recursive) throw new Error(`recursive child: ${v}`);
      if ((length - startIndex) !== 1) throw new Error(`not a single child: ${v}`);
      initializeChildren(parentNode, v as TagPropsChildren<Renderer>, undefined, true);
      break;
    }
    else if (isCustomUpdater(v as ChildUpdater)) { // before isFunction
      if (recursive) throw new Error(`recursive child: ${v}`);
      if ((length - startIndex) !== 1) throw new Error(`not a single child: ${v}`);
      (v as ChildUpdater)(parentNode);
      updaters = [v as ChildUpdater];
      break;
    }
    else if (isFunction(v)) { // todo refactor to recursive call

      const f = v as Function;

      v = f(); // renderer, condition

      if (v instanceof HTMLElement) {
        updaters ??= [];
        updaters.push(f as ChildUpdater);
      }
      else {
        let prev = v;

        if (v && isFunction(v)) v = prev = (v as Function)(); // condition renderer, child array

        if (v instanceof HTMLElement) {}
        else if (isLiteral(v)) (v as any) = document.createTextNode(v as string);
        else if (v && isArray(v)) {
          if (recursive) throw new Error(`recursive child: ${v}`);
          if ((length - startIndex) !== 1) throw new Error(`not a single child: ${f}`);
          initializeChildren(parentNode, v as TagPropsChildren<Renderer>, undefined, true);
          updaters = [() => {
            (parentNode as any).replaceChildren(); // todo remove "as any"
            initializeChildren(parentNode, f(), undefined, true);
          }];
          break;
        }
        else throw new Error(`unsupported child: ${f}`);

        updaters ??= [];
        updaters.push(createChildUpdater(v as unknown as HTMLElement, f, prev));
      }

      parentNode.append(v as string);
    }
    else {
      throw new Error(`unsupported child: ${v}`);
    }
  }

  return updaters;
};

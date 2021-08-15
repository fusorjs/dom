import {Child, isArray, isFunction, isLiteral} from '@perform/common';

import {Renderer, ChildUpdater} from '../types';
import {isCustomUpdater} from './updater/custom';
// import {updateNodes} from './update/nodes';

// const isHidden = (v: unknown) =>
//   v === false || v === null || v === undefined || v === true;

// todo refactor more

const hidden = Symbol();

const createChildUpdater = (node: Node, f: Function) => {
  let prev = hidden;

  return () => {
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

    (node as HTMLElement).replaceWith(v);

    node = v;
  };
}

// const createChildrenUpdater = (prevNodes, getNextNodes) => (parentNode) => {
//   const nextNodes = getNextNodes();

//   if (prevNodes === nextNodes) return;

//   updateNodes(parentNode, prevNodes, nextNodes);

//   prevNodes = nextNodes;
// };

const handleCallback = (f: () => Child<Renderer>, updaters: ChildUpdater[], parent: HTMLElement) => {
  const v = f(); // renderer, condition

  if (v && isFunction(v)) { // condition renderer, child array
    handleCallback(v as () => Child<Renderer>, updaters, parent);
  }
  else if (v instanceof HTMLElement) {
    updaters.push(f);
    parent.append(v);
  }
  else {
    if (v instanceof HTMLElement) {
      updaters.push(createChildUpdater(v, f));
      parent.append(v);
    }
    else if (isLiteral(v)) {
      const text = document.createTextNode(v as string);
      updaters.push(createChildUpdater(text, f));
      parent.append(text);
    }
    // else if (v && isArray(v)) {
    //   if (recursive) throw new Error(`recursive child: ${v}`);
    //   if ((length - startIndex) !== 1) throw new Error(`not a single child: ${f}`);
    //   initializeChildren(parent, v as Child<Renderer>[], undefined, true);
    //   updaters = [() => {
    //     (parent as any).replaceChildren(); // todo remove "as any"
    //     initializeChildren(parent, f() as Child<Renderer>[], undefined, true);
    //   }];
    //   break;
    // }
    else throw new Error(`unsupported child: ${f}`);
  }
}

export const initializeChildren = (
  parent: HTMLElement, children: Child<Renderer>[], startIndex = 0, // recursive = false
) => {
  let updaters: ChildUpdater[] | undefined, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    const v = children[index];

    if (! v) {
      // ? skip null | undefined | false | '' ?
      throw new Error(`unsupported child: ${v}`);
    }
    else if (isLiteral(v)) {
      parent.append(v as string);
    }
    // else if (isArray(v)) {
    //   if (recursive) throw new Error(`recursive child: ${v}`);
    //   if ((length - startIndex) !== 1) throw new Error(`not a single child: ${v}`);
    //   initializeChildren(parent, v as Child<Renderer>[], undefined, true);
    //   break;
    // }
    else if (isFunction(v)) {

      // if (isCustomUpdater(v as ChildUpdater)) {
      //   if (recursive) throw new Error(`recursive child: ${v}`);
      //   if ((length - startIndex) !== 1) throw new Error(`not a single child: ${v}`);
      //   (v as ChildUpdater)(parent);
      //   updaters = [v as ChildUpdater];
      //   break;
      // }

      updaters ??= [];
      handleCallback(v as () => Child<Renderer>, updaters, parent);
    }
    else {
      throw new Error(`unsupported child: ${v}`);
    }
  }

  return updaters;
};

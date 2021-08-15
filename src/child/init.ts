import {Child, isFunction, isLiteral} from '@perform/common';

import {Renderer, ChildUpdater} from '../types';

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
    else throw new Error(`unsupported child: ${f}`);
  }
}

export const initChildren = (
  parent: HTMLElement, children: Child<Renderer>[], startIndex = 0
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
    else if (isFunction(v)) {
      updaters ??= [];
      handleCallback(v as () => Child<Renderer>, updaters, parent);
    }
    else throw new Error(`unsupported child: ${v}`);
  }

  return updaters;
};

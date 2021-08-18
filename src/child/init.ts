import {Child, some, isFunction, isLiteral} from '@perform/common';

import {Renderer, ChildUpdater} from '../types';

// includes undefined, true coz ||
const isSkipable = (v: unknown) => v === false || v == null || v === '' || v === true;

// todo refactor

const createUpdater = (
  callback: () => Child<Renderer>, parent: HTMLElement
) => {
  let prevNode: Node;
  let prevChild: Child<Renderer>;

  const update = (recursed = 0) => {
    let child = callback();

    if (child instanceof HTMLElement) { // component renderer
      if (prevNode) { // update
        if (prevChild !== child) {
          parent.replaceChild(child, prevNode);
          prevNode = child;
        }
      }
      else { // init
        parent.append(child);
        prevNode = child;
      }
    }
    else if (isSkipable(child)) { // before: literal as '', function as null
      child = '';
      if (prevNode) { // update
        if (prevChild !== child) {
          const text = document.createTextNode(child);
          parent.replaceChild(text, prevNode);
          prevNode = text;
        }
      }
      else { // init
        const text = document.createTextNode(child);
        parent.append(text);
        prevNode = text;
      }
    }
    else if (isLiteral(child)) {
      if (prevNode) { // update
        if (prevChild !== child) {
          const text = document.createTextNode(child as string);
          parent.replaceChild(text, prevNode);
          prevNode = text;
        }
      }
      else { // init
        const text = document.createTextNode(child as string);
        parent.append(text);
        prevNode = text;
      }
    }
    else if (isFunction(child as some)) { // condition
      if (recursed === 5) throw new Error(`prevent indefinite loop: ${recursed++}`);
      update(recursed++);
    }
    else throw new Error(`unsupported child: ${callback}`);

    prevChild = child;
  };

  update(); // init

  return update;
};

export const initChildren = (
  parent: HTMLElement, children: Child<Renderer>[], startIndex = 0
) => {
  let updaters: ChildUpdater[] | undefined, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    const child = children[index];

    if (isSkipable(child)) { // before: literal as '', function as null
      // Do nothing, I love that! :)
    }
    else if (isLiteral(child)) {
      parent.append(child as string);
    }
    else if (isFunction(child as some)) { // dynamic value
      updaters ??= [];
      updaters.push(createUpdater(child as () => Child<Renderer>, parent));
    }
    else throw new TypeError(`unsupported child type: ${typeof child}`);
  }

  return updaters;
};

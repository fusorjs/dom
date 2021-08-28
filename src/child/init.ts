import {Child, some, isEmptyChild, isFunction, isLiteral, stringify} from '@perform/common';

import {Renderer, ChildUpdater} from '../types';

type RenderedChild = Child<Renderer> | ReturnType<Renderer>;

type Setter = (parentNode: Node, child: RenderedChild, prevNode: Node) => Node;

const initComponent: Setter = (parentNode, child) => {
  parentNode.appendChild(child as Node);
  return child as Node;
};

const updateComponent: Setter = (parentNode, child, prevNode) => {
  parentNode.replaceChild(child as Node, prevNode);
  return child as Node;
};

const initLiteral: Setter = (parentNode, child) => {
  const text = document.createTextNode(child as string);
  parentNode.appendChild(text);
  return text;
}

const updateLiteral: Setter = (parentNode, child, prevNode) => {
  if (prevNode instanceof Text) {
    prevNode.nodeValue = child as string;
    return prevNode;
  }

  const text = document.createTextNode(child as string);
  parentNode.replaceChild(text, prevNode);
  return text;
}

const update = (
  callback: () => Child<Renderer>, parentNode: Node,
  prevChild: RenderedChild, prevNode: Node,
  component: Setter, literal: Setter, recursed = 0,
): [prevChild: RenderedChild, prevNode: Node] => {
  let child: RenderedChild = callback();

  if (child instanceof HTMLElement) { // component renderer
    if (prevChild !== child) prevNode = component(parentNode, child, prevNode);
  }
  else if (isEmptyChild(child)) { // before: literal as '', function as null
    child = '';
    if (prevChild !== child) prevNode = literal(parentNode, child, prevNode);
  }
  else if (isLiteral(child)) {
    if (typeof child === 'number') child = child.toString(); // todo optimize the whole "switch" with typeof
    if (prevChild !== child) prevNode = literal(parentNode, child, prevNode);
  }
  else if (isFunction(child as some)) { // condition
    if (recursed === 5) throw new Error(`preventing indefinite recursion: ${recursed}`);
    return update(
      child as () => Child<Renderer>, parentNode,
      prevChild, prevNode,
      component, literal, recursed + 1
    );
  }
  else throw new Error(`illegal child: ${stringify(child)}; from: ${callback}`);

  prevChild = child;

  return [prevChild, prevNode]
};

const createUpdater = (
  callback: () => Child<Renderer>, parentNode: Node,
) => {
  let prevChild: RenderedChild;
  let prevNode: Node;

  // init
  [prevChild, prevNode] = update(
    callback, parentNode,
    prevChild, prevNode!, // we do not use prevNode in: initComponent, initLiteral
    initComponent, initLiteral
  );

  return () => {
    // update
    [prevChild, prevNode] = update(
      callback, parentNode,
      prevChild, prevNode,
      updateComponent, updateLiteral
    );
  };
};

export const initChildren = (
  parent: HTMLElement, children: readonly Child<Renderer>[], startIndex = 0
) => {
  let updaters: ChildUpdater[] | undefined, index = startIndex;

  for (const {length} = children; index < length; index ++) {
    const child = children[index];

    if (isEmptyChild(child)) { // before: literal as '', function as null
      // Do nothing, I love that! :)
    }
    else if (isLiteral(child)) { // static value
      // todo maybe optimize: concatenate serial static values to single node
      parent.append(child as string);
    }
    else if (isFunction(child!)) { // dynamic value
      updaters ??= [];
      updaters.push(createUpdater(child as () => Child<Renderer>, parent));
    }
    else throw new TypeError(`illegal child: ${stringify(child)}`);
  }

  return updaters;
};

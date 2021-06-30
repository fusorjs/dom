import {diffArray, PrevMap} from '@perform/base/array/diff';

import {Renderer} from '../../types';

import {customUpdater} from './custom';
import {swapNodes} from '../utils';

// ? move to components
// ? create one instance of component's prop/child updaters for all array items

const ITEM = 0;
const RENDER = 1;
const NODE = 2;

type Child <Item> = [
  ITEM: Item,
  RENDER: Renderer,
  NODE: HTMLElement,
];

// use `key` for perfomance optimization
// Without `key`, children will be recreated only if `getItem` returns different value.
// With `key`, children will be recreated only if `getItem` returns different value and the keys do not match.
// (keys will not match if you insert/delete)
export const diff = <Item> (
  getItems: () => Item[],
  createRenderer: (getItem: () => Item) => Renderer,
  key?: string,
) => {
  const prevArrayCache: Item[] = [];
  const prevMapCache: PrevMap<Item> = new Map();

  let prevArray: Item[];

  const children: Child<Item>[] = [];

  const createChild = (item: Item) => {
    const child: any = [item];
    const render = createRenderer(() => child[ITEM]);
    child.push(render, render());
    return child as Child<Item>;
  };

  // must be atomic/synchronous as renderers, nodes, childNodes are mutated
  return customUpdater((parent) => {
    const nextArray = getItems();

    if (nextArray === prevArray) return;

    prevArray = nextArray;

    diffArray({
      prevArray: prevArrayCache,
      prevMap: prevMapCache,
      nextArray,
      push: (item) => {
        const child = createChild(item);
        children.push(child);
        parent.append(child[NODE]);
      },
      insert: (index, item) => {
        const prevNode = children[index][NODE];
        const child = createChild(item);
        children.splice(index, 0, child);
        parent.insertBefore(child[NODE], prevNode);
      },
      replace: (index, item) => {
        const prevNode = children[index][NODE];
        const child = createChild(item);
        children[index] = child;
        prevNode.replaceWith(child[NODE]);
      },
      swap: (prevIndex, nextIndex) => {
        const prevChild = children[prevIndex];
        const nextChild = children[nextIndex];
        children[prevIndex] = nextChild;
        children[nextIndex] = prevChild;
        swapNodes(prevChild[NODE], nextChild[NODE]);
      },
      pop: () => {
        children.pop()![NODE].remove();
      },
      remove: (index) => {
        children.splice(index, 1)[0][NODE].remove();
      },
      key,
      update: (index, item) => {
        const child = children[index];
        child[ITEM] = item;
        child[RENDER]();
      },
    });
  });
};

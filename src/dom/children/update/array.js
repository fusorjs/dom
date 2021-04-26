import {arrayKeyDiff} from '../../../helpers/array/diff';

import {childrenUpdater} from '../initialize';
import {swapNodes} from '../utils';

// ? move to components
// ? create one instance of component's prop/child updaters for all array items

const ITEM = 0;
const RENDER = 1;
const NODE = 2;

// use `key` for perfomance optimization
// Without `key`, children will be recreated only if `getItem` returns different value.
// With `key`, children will be recreated only if `getItem` returns different value and the keys do not match.
// (keys will not match if you insert/delete)
export const childArray = (getItems, createRenderer, key) => {
  let items = [], children = [];

  const createChild = (item) => {
    const child = [item];
    const render = createRenderer(() => child[ITEM]);
    const node = render();
    child.push(render, node);
    return child;
  };

  // must be atomic/synchronous as renderers, nodes, childNodes are mutated
  return childrenUpdater((parentNode) => {
    arrayKeyDiff({
      prevItems: items,
      nextItems: items = getItems(),
      push: (item) => {
        const child = createChild(item);
        children.push(child);
        parentNode.append(child[NODE]);
      },
      insert: (index, item) => {
        const prevNode = children[index][NODE];
        const child = createChild(item);
        children.splice(index, 0, child);
        parentNode.insertBefore(child[NODE], prevNode);
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
        children.pop()[NODE].remove();
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

    console.log({items, children});
  });
};

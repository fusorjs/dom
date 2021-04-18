import {arrayDiff} from '../../../helpers/array/diff';

import {childrenUpdater} from '../initialize';

// ? move to components
// ? create one instance of component's prop/child updaters for all array items

// use idKey for perfomance optimization
// Without key, children will be recreated only if `getItem` returns different value.
// With key, children will be recreated only if `getItem` returns different value and the keys do not match.
// (keys will not match if you insert/delete)
export const childArray = (getItems, createRenderer, idKey) => {
  let items, children = [];

  // must be atomic/synchronous as renderers, nodes, childNodes are mutated
  return childrenUpdater((parentNode) => {
    arrayDiff({
      prevItems: items,
      nextItems: items = getItems(),
      push: (item) => {
        const child = [item];
        const render = createRenderer(() => child[0]);
        const node = render();

        child.push(render, node);
        children.push(child);
        parentNode.append(node);
      },
      // insert: (i) => {
      //   const render = createRenderer(() => items[i]);
      //   const node = render();
      //   const prevNode = nodes[i];

      //   renderers.splice(i, 0, render);
      //   nodes.splice(i, 0, node);

      //   if (prevNode) parentNode.insertBefore(node, prevNode);
      //   else parentNode.append(node);
      // },
      pop: () => {
        children.pop()[2].remove();
      },
      remove: (i) => {
        children.splice(i, 1)[0][2].remove();
      },
      // replace: (i) => {
      //   const render = createRenderer(() => items[i]);
      //   const node = render();
      //   const prevNode = nodes[i];

      //   renderers[i] = render;
      //   nodes[i] = node;

      //   prevNode.replaceWith(node);
      // },
      idKey,
      update: (i, item) => {
        const child = children[i];

        child[0] = item;
        child[1]();
      },
    });

    console.log({items, children});
  });
};

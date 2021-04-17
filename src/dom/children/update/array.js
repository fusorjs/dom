import {arrayDiff1} from '../../../helpers/array/diff';

import {childrenUpdater} from '../initialize';

// ? move to components
// ? create one instance of component's prop/child updaters for all array items

// use idKey for perfomance optimization
// Without key, children will be recreated only if `getItem` returns different value.
// With key, children will be recreated only if `getItem` returns different value and the keys do not match.
// (keys will not match if you insert/delete)
export const childArray = (getItems, createRenderer, idKey) => {
  let items, renderers = [], nodes = [];

  return childrenUpdater((parentNode) => {
    arrayDiff1({
      prevItems: items,
      nextItems: items = getItems(),
      insert: (i) => {
        const render = createRenderer(() => items[i]);
        const node = render();
        const prevNode = nodes[i];

        renderers.splice(i, 0, render);
        nodes.splice(i, 0, node);

        if (prevNode) parentNode.insertBefore(node, prevNode);
        else parentNode.append(node);
      },
      remove: (i) => {
        nodes[i].remove();

        renderers.splice(i, 1);
        nodes.splice(i, 1);
      },
      replace: (i) => {
        const render = createRenderer(() => items[i]);
        const node = render();
        const prevNode = nodes[i];

        renderers[i] = render;
        nodes[i] = node;

        prevNode.replaceWith(node);
      },
      idKey,
      update: (i) => {
        renderers[i]();
      },
    });

    console.log({items, renderers, nodes});

    // return renderers;
  });
};

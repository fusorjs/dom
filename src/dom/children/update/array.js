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

  // Render function:
  return childrenUpdater((parentNode) => {
    arrayDiff1({
      prevItems: items,
      nextItems: items = getItems(),
      insert: (i, n) => {
        const render = createRenderer(() => items[i]);
        const node = render();

        renderers.splice(i, 0, render);
        nodes.splice(i, 0, node);

        parentNode.append(node); // todo check
      },
      remove: (i, n) => {
        nodes[i].remove();

        renderers.splice(i, 1);
        nodes.splice(i, 1);
      },
      idKey,
      update: (i, p, n) => {
        renderers[i]();
      },
    });

    // console.log({items, renderers, childNodes});

    return renderers;
  });
};

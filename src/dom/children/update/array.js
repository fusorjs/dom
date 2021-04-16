import {arrayDiffIndexed} from '../../../helpers/array/diff';

import {childrenUpdater} from '../initialize';

// ? move to components
// ? create one instance of component's prop/child updaters for all array items

// use idKey for perfomance optimization
// Without key, children will be recreated only if `getItem` returns different value.
// With key, children will be recreated only if `getItem` returns different value and the keys do not match.
// (keys will not match if you insert/delete)
export const childArray = (getItems, createRenderer, idKey) => {
  let items, renderers = [], childNodes = [];

  const createNext = (index) => {
    if (idKey && items[index][idKey] === undefined) {
      throw new Error(`missing item id value for "${idKey}" in: ${items[index]}`);
    }

    const render = createRenderer(() => items[index]);
    const node = render();

    renderers[index] = render;
    childNodes[index] = node;

    return node;
  };

  // Render function:
  return childrenUpdater((parentNode) => {
    arrayDiffIndexed(
      (i, p, n) => {
        if (idKey && p[idKey] === n[idKey]) {
          renderers[i]();
        }
        else {
          childNodes[i].replaceWith(createNext(i)); // todo refactor props updater prev
        }
      },
      (i, n) => {
        parentNode.append(createNext(i));
      },
      (i, n) => {
        childNodes[i].remove();
        // renderers.splice(i, 1);
        // childNodes.splice(i, 1);
        // renderers.pop(); // todo
        // childNodes.pop(); // todo
      },
      items,
      items = getItems(),
    );

    return renderers;
  });
};

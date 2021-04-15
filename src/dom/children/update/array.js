import {arrayDiffIndexed} from '../../../helpers/array/diff';

import {childrenUpdater} from '../initialize';

// ? move to components
// ? create one instance of component's prop/child updaters for all array items

const ID_KEY = '__PERFORM_ID';

// use idKey for perfomance optimization
// Without key, children will be recreated only if `getItem` returns different value.
// With key, children will be recreated only if `getItem` returns different value and the keys do not match.
// (keys will not match if you insert/delete)
export const childArray = (getItems, createRenderer, idKey) => {
  let items, renderers = [], childNodes = [];

  const createNext = (index) => {
    const render = createRenderer(() => items[index]);

    if (idKey) {
      const id = items[index][idKey];

      if (id === undefined)
        throw new Error(`missing item id value for "${idKey}" in: ${items[index]}`);

      render[ID_KEY] = id;
    }

    renderers[index] = render;

    const node = render();

    childNodes[index] = node;

    return node;
  };

  // Render function:
  return childrenUpdater((parentNode) => {
    arrayDiffIndexed(
      (i, p, n) => {
        const render = renderers[i];

        if (idKey && render[ID_KEY] === n[idKey]) {
          render();
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
        // renderers.pop(); // todo
      },
      items,
      items = getItems(),
    );

    return renderers;
  });
};

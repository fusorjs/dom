import {arrayDiffIndexed} from '../../../helpers/array/diff';

// ? move to components
// ? create one instance of component's prop/child updaters for all array items

const ID_KEY = '__PERFORM_ID';

// use idKey for perfomance optimization
// Without key, children will be recreated only if `getItem` returns different value.
// With key, children will be recreated only if `getItem` returns different value and the keys do not match.
// (keys will not match if you insert/delete)
export const childArray = (getItems, createRenderer, idKey) => {
  let items, renderers = [];

  const createNext = (index) => {
    const render = createRenderer(() => items[index]);

    if (idKey) {
      const id = items[index][idKey];

      if (id === undefined)
        throw new Error(`missing item id value for "${idKey}" in: ${items[index]}`);

      render[ID_KEY] = id;
    }

    return render;
  };

  // Render function:
  return () => {
    arrayDiffIndexed(
      (i, p, n) => {
        const render = renderers[i];

        if (idKey && render[ID_KEY] === n[idKey]) {
          render();
        }
        else {
          renderers[i] = createNext(i); // todo refactor props updater prev
        }
      },
      (i, n) => {
        renderers.push(createNext(i));
      },
      (i, n) => {
        renderers.pop();
      },
      items,
      items = getItems(),
    );

    return renderers;
  };
};

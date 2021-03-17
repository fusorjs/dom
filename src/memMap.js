
// todo: memo component map, create one instance of component's prop/child updaters
// todo jsonpatch compatibility

const ID_KEY = '__PERFORM_ID';

// use idKey for perfomance optimization
export const memMap = (getItems, createRenderer, idKey) => {
  let prevItems, prevRenderers, nextItems;

  const createNext = (index) => {
    const render = createRenderer(() => nextItems[index]);

    if (idKey) {
      const id = nextItems[index][idKey];

      if (id === undefined)
        throw new Error(`missing item id value for "${idKey}" in: ${nextItems[index]}`);

      render[ID_KEY] = id;
    }

    return render;
  };

  // Render function:
  return () => {
    nextItems = getItems();

    // console.log(prevItems, nextItems)

    // All subsequent runs:
    if (prevItems) {
      if (prevItems === nextItems) return prevRenderers;

      const prevLength = prevItems.length;
      const nextLength = nextItems.length;

      let i = 0, nextRenderers;

      // update
      for (const minLength = Math.min(prevLength, nextLength); i < minLength; i ++) {
        // console.log(prevItems[i] === nextItems[i]);
        const nextItem = nextItems[i];

        if (prevItems[i] !== nextItem) {
          const prevRenderer = prevRenderers[i];

          if (idKey && prevRenderer[ID_KEY] === nextItem[idKey]) {
            // console.log(render[ID_KEY], i);
            prevRenderer();
          }
          else {
            nextRenderers ??= prevRenderers.slice(0, minLength);
            nextRenderers[i] = createNext(i); // todo refactor props updater prev
          }
        }
      }

      if (prevLength !== nextLength) {
        // create
        if (prevLength < nextLength) {
          nextRenderers ??= [...prevRenderers];
          for (; i < nextLength; i ++) nextRenderers.push(createNext(i));
        }
        // delete
        else if (prevLength > nextLength) {
          nextRenderers ??= prevRenderers.slice(0, nextLength);
        }
      }

      if (nextRenderers) prevRenderers = nextRenderers;
    }
    // The first run:
    else {
      const nextLength = nextItems.length;
      prevRenderers = [];
      for (let i = 0; i < nextLength; i ++) prevRenderers.push(createNext(i));
    }

    prevItems = nextItems;

    return prevRenderers;
  };
};

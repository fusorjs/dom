
export interface DiffBinary <Item> {
  (index: number, item: Item): void;
}

interface DiffProps <Item> {
  prevItems?: readonly Item[];
  nextItems?: readonly Item[];
  push: (item: Item) => void; // append to the end
  pop: () => void; // remove from the end
  // insert: DiffBinary<Item>; // todo insert into/before index
  remove: (index: number) => void; // todo remove at index
  // move: (fromIndex: number, toIndex: number) => void; // todo move from index to index
  // replace?: DiffBinary<Item>; // ? do we need it // replace with a new item at index
}

interface DiffKeyProps <Item extends KeyMap> {
  idKey: string;
  update: DiffBinary<Item>; // update item data with the same key
}

export function arrayDiff<Item extends KeyMap> (props: DiffProps<Item> & DiffKeyProps<Item>): void;
export function arrayDiff<Item> (props: DiffProps<Item>): void;
export function arrayDiff<Item> ({
  prevItems, nextItems, push, pop, remove, idKey, update
}: DiffProps<Item> & Partial<DiffKeyProps<Item>>) {
  if (prevItems === nextItems) return;

  const prevLength = prevItems?.length ?? 0;
  const nextLength = nextItems?.length ?? 0;
  const minLength = Math.min(prevLength, nextLength);

  let indexPrev = 0, indexNext = 0;

  for (; indexPrev < minLength; indexNext ++, indexPrev ++) {
    const p = (prevItems as readonly Item[])[indexPrev];
    const n = (nextItems as readonly Item[])[indexNext];

    // * no change
    if (p === n) continue;

    // * update
    if (idKey) {
      const nid = (n as KeyMap)[idKey];

      if ((p as KeyMap)[idKey] === nid) {
        (update as DiffBinary<Item>)(indexNext, n);
        continue;
      }

      if (nid === undefined) {
        throw new Error(`missing item id value for "${idKey}" in: ${n}`);
      }
    }

    // // * move
    // for (let _i = i + 1; _i < nextLength; i ++) {
    //   const _n = (nextItems as readonly Item[])[_i];

    //   if (p === _n) {
    //     throw new Error(`move not implemented yet`);
    //   }

    //   // todo idKey update
    // }

    // // * replace
    // if (replace) replace(i, p, n);
    // else {
    //   remove(i, p);
    //   insert(i, n);
    // }

    // * remove
    remove(indexNext);
    indexNext --; // keep next item the same
  }

  // * rest
  if (prevLength !== nextLength) {
    // * push
    if (nextLength > prevLength) {
      for (let i = minLength; i < nextLength; i ++)
        push((nextItems as readonly Item[])[i]);
    }
    // * pop
    else {
      // // 1
      // for (let i = minLength; i < prevLength; i ++)
      //   remove(i, (prevItems as readonly Item[])[i]);
      // // 2
      // for (let i = prevLength - 1; i >= minLength; i --)
      //   remove(i, (prevItems as readonly Item[])[i]);
      // 3
      const start = minLength - 1 + (indexPrev - indexNext);

      for (let i = prevLength - 1; i > start; i --) pop();
    }
  }
};

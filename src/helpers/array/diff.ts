export interface DiffOne <Item> { // unary
  (index: number, item: Item): void;
}
export interface DiffTwo <Item> { // binary
  (index: number, prev: Item, next: Item): void;
}

interface DiffProps <Item> {
  push: DiffOne<Item>;
  // insert: DiffOne<Item>; // todo
  remove: DiffOne<Item>; // todo: split out pop
  // move: DiffTwo<Item>; // todo
  // replace?: DiffTwo<Item>; // ? do we need it
  prevItems?: readonly Item[];
  nextItems?: readonly Item[];
}

interface DiffKeyProps <Item extends KeyMap> {
  idKey: string;
  update: DiffTwo<Item>;
}

export function arrayDiff1<Item extends KeyMap> (props: DiffProps<Item> & DiffKeyProps<Item>): void;
export function arrayDiff1<Item> (props: DiffProps<Item>): void;
export function arrayDiff1<Item> ({
  push, remove, prevItems, nextItems, idKey, update
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
        (update as DiffTwo<Item>)(indexNext, p, n);
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
    remove(indexNext, p);
    indexNext --; // keep next item the same
  }

  // * rest
  if (prevLength !== nextLength) {
    // * push
    if (nextLength > prevLength) {
      for (let i = minLength; i < nextLength; i ++)
      push(i, (nextItems as readonly Item[])[i]);
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

      for (let i = prevLength - 1; i > start; i --)
        remove(i, (prevItems as readonly Item[])[i]);
    }
  }
};

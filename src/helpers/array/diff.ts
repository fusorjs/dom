
export interface DiffUpdate <Item> {
  (index: number, prev: Item, next: Item): void;
}
export interface DiffItem <Item> {
  (index: number, item: Item): void;
}

// does not create new arrays
export const arrayDiff = <Item> (
  update: DiffUpdate<Item>,
  create: DiffItem<Item>,
  remove: DiffItem<Item>,
  prevItems?: readonly Item[],
  nextItems?: readonly Item[],
) => {
  const prevLength = prevItems?.length ?? 0;
  const nextLength = nextItems?.length ?? 0;
  const minLength = Math.min(prevLength, nextLength);

  // todo move for idKey
  // this is simple index comparator
  for (let i = 0; i < minLength; i ++) {
    const p = (prevItems as readonly Item[])[i];
    const n = (nextItems as readonly Item[])[i];
    if (p !== n) update(i, p, n);
  }

  if (prevLength !== nextLength) {
    if (nextLength > prevLength) {
      for (let i = minLength; i < nextLength; i ++)
        create(i, (nextItems as readonly Item[])[i]);
    }
    else if (prevLength > nextLength) {
      for (let i = minLength; i < prevLength; i ++)
        remove(i, (prevItems as readonly Item[])[i]);
    }
  }
};

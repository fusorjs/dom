
export interface DiffUpdate <Item> {
  (index: number, prev: Item, next: Item): void;
}
export interface DiffItem <Item> {
  (index: number, item: Item): void;
}

// todo move, test
// simple diff based on array index
export const arrayDiffIndexed = <Item> (
  update: DiffUpdate<Item>,
  create: DiffItem<Item>,
  remove: DiffItem<Item>,
  prevItems?: readonly Item[],
  nextItems?: readonly Item[],
) => {
  if (prevItems === nextItems) return;

  const prevLength = prevItems?.length ?? 0;
  const nextLength = nextItems?.length ?? 0;
  const minLength = Math.min(prevLength, nextLength);

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

/*
// const lookAheadFor = <Item>(
//   item: Item,
//   startIndex: number,
//   nextItems: readonly Item[],
//   nextLength: number,
// ) => {
//   for (let i = startIndex; i < nextLength; i ++) {
//   }
// };

// advanced diff based on array index and identity key
export const arrayDiffKeyed = <Item> (
  update: DiffUpdate<Item>,
  create: DiffItem<Item>,
  remove: DiffItem<Item>,
  // todo move for idKey
  // idKey?: string,
  prevItems?: readonly Item[],
  nextItems?: readonly Item[],
) => {
  const prevLength = prevItems?.length ?? 0;
  const nextLength = nextItems?.length ?? 0;
  const maxLength = Math.max(prevLength, nextLength);

  for (let index = 0; index < maxLength; index ++) {
    const p = prevItems?.[index];
    const n = nextItems?.[index];

    if (p === n) continue;

    if (p !== undefined && n !== undefined) {


      // if (idKey && (p as any)[idKey] === (n as any)[idKey]) {
      //   update(index, p, n);
      // }

      for (let i = index + 1; i < nextLength; i ++) {
      }

    }

  }
};
*/

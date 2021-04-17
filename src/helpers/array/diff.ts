export interface DiffOne <Item> {
  (index: number, item: Item): void;
}
export interface DiffTwo <Item> {
  (index: number, prev: Item, next: Item): void;
}

interface DiffProps <Item> {
  insert: DiffOne<Item>;
  remove: DiffOne<Item>;
  replace?: DiffTwo<Item>;
  prevItems?: readonly Item[];
  nextItems?: readonly Item[];
}

interface DiffKeyProps <Item extends KeyMap> {
  idKey: string;
  update: DiffTwo<Item>;
}

// todo move, test
export function arrayDiff1<Item extends KeyMap> (props: DiffProps<Item> & DiffKeyProps<Item>): void;
export function arrayDiff1<Item> (props: DiffProps<Item>): void;
export function arrayDiff1<Item> ({
  insert, remove, replace, prevItems, nextItems, idKey, update
}: DiffProps<Item> & Partial<DiffKeyProps<Item>>) {
  if (prevItems === nextItems) return;

  const prevLength = prevItems?.length ?? 0;
  const nextLength = nextItems?.length ?? 0;
  const minLength = Math.min(prevLength, nextLength);

  for (let i = 0; i < minLength; i ++) {
    const p = (prevItems as readonly Item[])[i];
    const n = (nextItems as readonly Item[])[i];

    if (p === n) continue;

    if (idKey) {
      const nid = (n as KeyMap)[idKey];

      if ((p as KeyMap)[idKey] === nid) {
        (update as DiffTwo<Item>)(i, p, n);
        continue;
      }

      if (nid === undefined) {
        throw new Error(`missing item id value for "${idKey}" in: ${n}`);
      }
    }

    if (replace) replace(i, p, n);
    else {
      remove(i, p);
      insert(i, n);
    }
  }

  if (prevLength !== nextLength) {
    if (nextLength > prevLength) {
      for (let i = minLength; i < nextLength; i ++)
        insert(i, (nextItems as readonly Item[])[i]);
    }
    else if (prevLength > nextLength) {
      // for (let i = minLength; i < prevLength; i ++)
      //   remove(i, (prevItems as readonly Item[])[i]);
      for (let i = prevLength - 1; i >= minLength; i --)
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
  // todo move
  prevItems?: readonly Item[],
  nextItems?: readonly Item[],
  idKey?: string,
) => {
  const prevLength = prevItems?.length ?? 0;
  const nextLength = nextItems?.length ?? 0;
  const maxLength = Math.max(prevLength, nextLength);

  for (let i = 0; i < maxLength; i ++) {
    const p = prevItems?.[i];
    const n = nextItems?.[i];

    if (p === n) continue;

    if (p !== undefined) {
      remove(i, p);
    }

    if (p !== undefined && n !== undefined) {

    }

  }
};
*/

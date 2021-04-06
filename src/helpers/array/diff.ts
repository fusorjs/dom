
export interface ArrayDiffer <Item> {
  (startIndex: number, length: number, prevItems: readonly Item[], nextItems: readonly Item[]): void;
}

export const arrayDiff = <Item> (
  update: ArrayDiffer<Item>,
  append: ArrayDiffer<Item>,
  remove: ArrayDiffer<Item>,
  prevItems: readonly Item[],
  nextItems: readonly Item[],
) => {
  const prevLength = prevItems.length;
  const nextLength = nextItems.length;
  const minLength = Math.min(prevLength, nextLength);

  if (minLength) update(0, minLength, prevItems, nextItems);

  if (prevLength !== nextLength) {
    if (prevLength < nextLength) append(minLength, nextLength, prevItems, nextItems);
    else if (prevLength > nextLength) remove(minLength, prevLength, prevItems, nextItems);
  }
};

export const arrayCompare = <Item> (
  replace: (index: number, prevItem: Item, nextItem: Item) => void
): ArrayDiffer<Item> => (index, length, prevItems, nextItems) => {
  for (; index < length; index ++) {
    const p = prevItems[index];
    const n = nextItems[index];

    if (p !== n) replace(index, p, n);
  }
};

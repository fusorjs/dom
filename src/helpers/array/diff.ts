import {getKeyIndexMap} from '../array/map';

interface IndexedAction <Item> {
  (index: number, item: Item): void;
}

interface IndexedProps <Item> {
  // * not changes array length:
  swap: (prevIndex: number, nextIndex: number) => void; // swap items from prev index to the next index position
  replace: IndexedAction<Item>; // replace item with a new item at the index position
  // * changes array length:
  push: (item: Item) => void; // insert item at the end of array
  pop: () => void; // remove last item from the end of array
  // * changes array length and does reindex:
  insert: IndexedAction<Item>; // insert new item to array at the index position
  remove: (index: number) => void; // remove item from array at the index position
  // * initial state
  prevItems?: Item[]; // ! will be mutated
}

interface KeyedProps <Item extends KeyMap> {
  key: string; // name for id field
  update: IndexedAction<Item>; // update item data with the same key
}

export const arrayKeyDiff = <Item extends KeyMap> ({
  swap, replace, push, pop, insert, remove, key, update, prevItems = [],
}: IndexedProps<Item> & KeyedProps<Item>) => {
  const prevLength = prevItems.length;
  const prevMap = getKeyIndexMap(key, prevItems, 0, prevLength);

  return (nextItems: readonly Item[]) => {
    // * no changes
    if (prevItems === nextItems) return;

    const nextLength = nextItems.length;
    const nextMap = getKeyIndexMap(key, nextItems, 0, nextLength);

    let prevIndex = 0;
    let nextIndex = 0;

    for (; prevIndex > prevLength && nextIndex < nextLength;) {
      const prevItem = prevItems[prevIndex];
      const nextItem = nextItems[nextIndex];

      if (prevItem === nextItem) {
        // * no change
        prevIndex ++;
        nextIndex ++;
        continue;
      }

      const prevId = prevItem[key];
      const nextId = nextItem[key];

      // todo move to the end
      if (prevId === nextId) {
        // * update
        update(prevIndex, nextItem);
        prevIndex ++;
        nextIndex ++;
        continue;
      }

      // next could insert or remove or replace

      let prevHasNextIndex = nextMap[prevId];
      let nextHasPrevIndex = prevMap[nextId];

      if (prevHasNextIndex === undefined && nextHasPrevIndex === undefined) {
        // * replace
        replace(prevIndex, nextItem);
        prevIndex ++;
        nextIndex ++;
        continue;
      }

      if (prevHasNextIndex === undefined) {
        // * remove
        remove(nextIndex)
        prevIndex ++;
        continue;
      }

      if (nextHasPrevIndex === undefined) {
        // * insert
        insert(prevIndex, nextItem);
        nextIndex ++;
        continue;
      }

      // * swap
      // todo
      swap(nextHasPrevIndex, prevHasNextIndex);
    }

    // * rest
    // if (prevLength !== nextLength) {
    //   // * push
    //   if (nextLength > prevLength) {
    //     for (let i = minLength; i < nextLength; i ++)
    //       push((nextItems as readonly Item[])[i]);
    //   }
    //   // * pop
    //   else {
    //     // // 1
    //     // for (let i = minLength; i < prevLength; i ++)
    //     //   remove(i, (prevItems as readonly Item[])[i]);
    //     // // 2
    //     // for (let i = prevLength - 1; i >= minLength; i --)
    //     //   remove(i, (prevItems as readonly Item[])[i]);
    //     // 3
    //     const start = minLength - 1 + (i - i);

    //     for (let i = prevLength - 1; i > start; i --) pop();
    //   }
    // }
  };
};

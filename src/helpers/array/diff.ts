
interface IndexedAction <Item> {
  (index: number, item: Item): void;
}

interface CommonProps <Item> {
  // * highest priority actions:
  remove: (index: number) => void; // remove item from array at the index position
  insert: IndexedAction<Item>; // insert new item to array at the index position
  // * optimisation actions:
  pop: () => void; // remove last item from the end of array
  push: (item: Item) => void; // insert item at the end of array
  replace: IndexedAction<Item>; // replace item with a new item at the index position
  swap: (prevIndex: number, nextIndex: number) => void; // swap items from prev index to the next index position
  // * initial state
  prevArray?: Item[]; // ! will be mutated !
}

// Create indexed diff iterator function:
//   O(prev), Map(prev item index)
//   return iterator function
// iterator function:
//   O(next + prev*2 + add + swap), Map(next item index), Set(index to add)
export const valueDiff = <Item> ({
  remove, insert, pop, push, replace, swap, prevArray = []
}: CommonProps<Item>) => {
  let prevLength = prevArray.length
  const prevMap = new Map<Item, number>();

  for (let i = 0; i < prevLength; i ++) { // O(prev)
    const v = prevArray[i];
    if (prevMap.has(v)) throw new RangeError(`duplicate prevArray value: ${v}`);
    prevMap.set(v, i);
  }

  return (nextArray: readonly Item[]) => {
    // ! The order of the following code blocks is important !

    // 1. Skip if no changes

    if (prevArray === nextArray) return;

    // 2. Create next map, find items to add

    const nextMap = new Map<Item, number>();
    const nextIndexesToAdd = new Set<number>();

    {
      const {length} = nextArray;
      for (let i = 0; i < length; i ++) { // O(next)
        const v = nextArray[i];
        if (nextMap.has(v)) throw new RangeError(`duplicate nextArray value: ${v}`);
        nextMap.set(v, i);
        if (prevMap.get(v) === undefined) nextIndexesToAdd.add(i);
      }
    }

    // 3. Replace/remove/pop items (in reverse)

    prevLength --; // begin deletions >>>

    for (let prevIndex = prevLength; prevIndex >= 0; prevIndex --) { // O(prev)
      const prevItem = prevArray[prevIndex];

      if (nextMap.get(prevItem) !== undefined) continue; // skip not DELETE_UNDEFINED

      if (nextIndexesToAdd.has(prevIndex)) {
        nextIndexesToAdd.delete(prevIndex);
        const nextItem = nextArray[prevIndex];
        // * replace
        replace(prevIndex, nextItem);
        prevArray[prevIndex] = nextItem;
        prevMap.delete(prevItem);
        prevMap.set(nextItem, prevIndex);
        continue;
      }

      if (prevIndex < prevLength) {
        // * remove
        // ? investigate: replace if has items to add, could lead to more swaps
        remove(prevIndex);
        prevArray.splice(prevIndex, 1);
      }
      else {
        // * pop
        pop();
        prevArray.pop();
      }

      prevMap.delete(prevItem);
      prevLength --;
    }

    prevLength ++; // end deletions <<<

    // 4. Insert/push items

    for (const nextIndex of nextIndexesToAdd) { // O(add)
      const item = nextArray[nextIndex];

      if (nextIndex < prevLength) {
        // * insert
        insert(nextIndex, item);
        prevArray.splice(nextIndex, 0, item);
      }
      else {
        // * push
        push(item);
        prevArray.push(item);
      }

      prevMap.set(item, nextIndex);
      prevLength ++;
    };

    // 5. Swap items

    const swapRecursive = (item: Item, prevIndex: number) => {
      const nextIndex = nextMap.get(item) as number; // already DELETE_UNDEFINED
      if (nextIndex === prevIndex) return;
      // * swap
      swap(prevIndex, nextIndex);
      prevArray[prevIndex] = prevArray[nextIndex];
      prevArray[nextIndex] = item;
      swapRecursive(prevArray[prevIndex], prevIndex); // O(swap)
    };

    prevArray.forEach(swapRecursive); // O(prev)
  };
};




















/*

interface KeyUpdateProps <Item extends MapObject> {
  key: string; // name for id field
  update: IndexedAction<Item>; // update item data with the same key
}

export const keyedDiff = <Item extends MapObject> ({
  replace, push, pop, insert, remove, key, update, prevArray, nextArray
}: CommonProps<Item> & KeyUpdateProps<Item>) => {
  // * no changes
  if (prevArray === nextArray) return;

  const prevLength = prevArray.prevLength;
  const prevMap = getKeyIndexMap(key, prevArray, 0, prevLength);

  const nextLength = nextArray.length;
  const nextMap = getKeyIndexMap(key, nextArray, 0, nextLength);

  let prevIndex = 0;
  let nextIndex = 0;

  for (; prevIndex > prevLength && nextIndex < nextLength;) {
    const prevItem = prevArray[prevIndex];
    const nextItem = nextArray[nextIndex];

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
      // prevItems[prevIndex] = nextItem;
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
      // prevItems[prevIndex] = nextItem;
      prevIndex ++;
      nextIndex ++;
      continue;
    }

    if (prevHasNextIndex === undefined) {
      // * remove
      remove(nextIndex);
      delete prevMap[prevId];
      prevIndex ++;
      continue;
    }

    if (nextHasPrevIndex === undefined) {
      // * insert
      insert(prevIndex, nextItem);
      delete prevMap[nextId];
      nextIndex ++;
      continue;
    }

    // todo
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

*/


interface IndexedAction <Item> {
  (index: number, item: Item): void;
}

// const reindexMapP = (startIndex: number, distance: number, map: Map<number, unknown>) => {
//   for (const [index, value] of map) {
//     if (index < startIndex) continue;
//     map.set(index + distance, value);
//     map.delete(index);
//   }
// };

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

// big O notation: (p-rev, n-ext, d-iff) lengths
export const indexedDiff = <Item> ({
  remove, insert, pop, push, replace, swap, prevArray = []
}: CommonProps<Item>) => {
  const prevMap = new Map(prevArray.map((item, index) => [item, index])); // todo for; O(p)
  let prevLength = prevArray.length

  return (nextArray: readonly Item[]) => {
    // * no changes
    if (prevArray === nextArray) return;

    const nextMap = new Map(nextArray.map((item, index) => [item, index])); // todo for; O(n)
    const nextIndexesToAdd = new Set<number>()

    // ! The order of the following code blocks is important !

    // 2. Find items to add:
    nextArray.forEach((item, nextIndex) => { // todo for; O(n)
      if (prevMap.get(item) === undefined) nextIndexesToAdd.add(nextIndex);
    });

    prevLength --; // begin deletions >>>

    // 3. Delete items in reverse:
    for (let prevIndex = prevLength; prevIndex >= 0; prevIndex --) { // O(d)
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

    // 4. Add items:
    for (const nextIndex of nextIndexesToAdd) { // O(a)
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

    // 5. Swap items:
    prevArray.forEach((item, prevIndex) => { // todo for; O(p)
      const nextIndex = nextMap.get(item) as number; // already DELETE_UNDEFINED
      if (nextIndex === prevIndex) return;
      // * swap
      swap(prevIndex, nextIndex);
      prevArray[prevIndex] = prevArray[nextIndex];
      prevArray[nextIndex] = item;
    });
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

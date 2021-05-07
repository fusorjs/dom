import {getKeyIndexMap} from '../array/map';

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
  prevArray: readonly Item[];
  nextArray: readonly Item[];
  // * highest priority actions:
  remove: (index: number) => void; // remove item from array at the index position
  insert: IndexedAction<Item>; // insert new item to array at the index position
  // * optimisation actions:
  pop: () => void; // remove last item from the end of array
  push: (item: Item) => void; // insert item at the end of array
  replace: IndexedAction<Item>; // replace item with a new item at the index position
  swap: (prevIndex: number, nextIndex: number) => void; // swap items from prev index to the next index position
}

// big O notation: (p-rev, n-ext, d-iff) lengths
export const indexedDiff = <Item> ({
  prevArray, nextArray, remove, insert, pop, push, replace, swap
}: CommonProps<Item>) => {
  // * no changes
  if (prevArray === nextArray) return;

  const prevIndexesToDelete: number[] = [];
  const nextIndexesToAdd = new Set<number>()
  const prevIndexesToSwap = new Map<number, number>(); // <prevIndex, nextIndex>
  const prevIndexesShift: {[prevIndex: number]: number} = Object.create(null);

  // ! The order of the following code blocks is important !

  // 1. Get prev differences:
  {
    const nextMap = new Map(nextArray.map((item, index) => [item, index])); // todo for; O(n)
    prevArray.forEach((item, prevIndex) => { // todo for; O(p)
      const nextIndex = nextMap.get(item);
      if (nextIndex === prevIndex) return;
      if (nextIndex === undefined) prevIndexesToDelete.push(prevIndex);
      // else prevIndexesToSwap.set(prevIndex, nextIndex);
      // else if (prevIndex < nextIndex) prevIndexesToSwap.set(prevIndex, nextIndex);
      else if (! prevIndexesToSwap.has(nextIndex)) prevIndexesToSwap.set(prevIndex, nextIndex);
    });
  }

  // 2. Get next differences:
  {
    const prevMap = new Map(prevArray.map((item, index) => [item, index])); // todo for; O(p)
    nextArray.forEach((item, nextIndex) => { // todo for; O(n)
      const prevIndex = prevMap.get(item);
      if (prevIndex === nextIndex) return;
      if (prevIndex === undefined) nextIndexesToAdd.add(nextIndex);
      // else if (! prevIndexesToSwap.has(prevIndex)) prevIndexesToSwap.set(prevIndex, nextIndex);
    });
  }

  const hasItemsToSwap = prevIndexesToSwap.size > 0;
  let {length} = prevArray;

  length --;

  // 3. Delete items in reverse:
  for (let i = prevIndexesToDelete.length - 1; i >= 0; i --) { // O(d)
    const prevIndex = prevIndexesToDelete[i];

    if (nextIndexesToAdd.has(prevIndex)) {
      // * replace
      replace(prevIndex, nextArray[prevIndex]);
      nextIndexesToAdd.delete(prevIndex);
      continue;
    }

    if (prevIndex < length) {
      // * remove
      remove(prevIndex);
      if (hasItemsToSwap) {
        prevIndexesShift[prevIndex] ??= 0;
        prevIndexesShift[prevIndex] -= 1;
      }
    }
    else {
      // * pop
      pop();
    }

    length --;
  }

  length ++;

  // 4. Add items:
  for (const nextIndex of nextIndexesToAdd) { // O(a)
    const item = nextArray[nextIndex];

    if (nextIndex < length) {
      // * insert
      insert(nextIndex, item);
      if (hasItemsToSwap) {
        prevIndexesShift[nextIndex] ??= 0;
        prevIndexesShift[nextIndex] += 1;
      }
    }
    else {
      // * push
      push(item);
    }

    length ++;
  };

  let shift = 0;

  // 5. Swap items:
  for (const [prevIndex, nextIndex] of prevIndexesToSwap) { // O(s)
    // todo shift
    // * swap
    // swap(prevIndex, nextIndex);
  }
};

interface KeyUpdateProps <Item extends MapObject> {
  key: string; // name for id field
  update: IndexedAction<Item>; // update item data with the same key
}

export const keyedDiff = <Item extends MapObject> ({
  replace, push, pop, insert, remove, key, update, prevArray, nextArray
}: CommonProps<Item> & KeyUpdateProps<Item>) => {
  // * no changes
  if (prevArray === nextArray) return;

  const prevLength = prevArray.length;
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


export interface IndexItemAction <Item> {
  (index: number, item: Item): void;
}

interface ValueProps <Item> {
  // * highest priority actions:
  remove: (index: number) => void; // remove item from array at the index position
  insert: IndexItemAction<Item>; // insert new item to array at the index position
  // * optimisation actions:
  pop: () => void; // remove last item from the end of array
  push: (item: Item) => void; // insert item at the end of array
  replace: IndexItemAction<Item>; // replace item with a new item at the index position
  swap: (prevIndex: number, nextIndex: number) => void; // swap items from prev index to the next index position
  // * initial state
  prevArray?: Item[]; // ! will be mutated to match nextArray, make a copy if you need to keep the original value !
}

interface KeyProps <Item extends MapObject> {
  key: string; // name for id field
  update: IndexItemAction<Item>; // update item data with the same key
}

// Create value diff function:
// return diff iterator function
export const createDiff = <Item> ({
  remove, insert, pop, push, replace, swap, prevArray = [], key, update,
}: ValueProps<Item> & Partial<KeyProps<Item>>) => {

  if (key && ! update) throw new RangeError(`no "update" property provided`); // UPDATE_DEFINED_WITH_KEY

  let prevLength = prevArray.length

  // return diff iterator function:
  // O(next*2 + prev*2 + add + swap), Map(prev item index), Map(next item index), Set(index to add)
  return (nextArray: readonly Item[]) => {

    // ! The order of the following code blocks is important !

    // 1. Skip if no changes

    if (prevArray === nextArray) return;

    // 2. Create next map, find items to add/update

    const nextMap = new Map<Item, number>();
    const nextIndexesToAdd = new Set<number>();

    {
      // Create prev map

      const prevMap = new Map<Item, number>(); // ! temporal because remove/insert will require full reindex !

      for (let prevIndex = 0; prevIndex < prevLength; prevIndex ++) { // O(prev)
        const prevItem = prevArray[prevIndex];
        const prevId = key ? (prevItem as MapObject)[key] : prevItem;

        if (prevMap.has(prevId)) throw new RangeError(`prevArray duplicate: ${prevId}`);

        prevMap.set(prevId, prevIndex);
      }

      // Create next map

      const nextLength = nextArray.length;

      for (let nextIndex = 0; nextIndex < nextLength; nextIndex ++) { // O(next)
        const nextItem = nextArray[nextIndex];
        const nextId = key ? (nextItem as MapObject)[key] : nextItem;

        if (nextMap.has(nextId)) throw new RangeError(`nextArray duplicate: ${nextId}`);

        nextMap.set(nextId, nextIndex);

        const prevIndex = prevMap.get(nextId);

        if (prevIndex === undefined) {
          nextIndexesToAdd.add(nextIndex);
          continue;
        }

        if (key) {
          const prevItem = prevArray[prevIndex];

          if (prevItem !== nextItem) {
            // * update
            (update as IndexItemAction<Item>/* UPDATE_DEFINED_WITH_KEY */)(prevIndex, nextItem);
            prevArray[prevIndex] = nextItem;
          }
        }
      }
    }

    // 3. Replace/remove/pop items (in reverse)

    prevLength --; // begin deletions >>>

    for (let prevIndex = prevLength; prevIndex >= 0; prevIndex --) { // O(prev)
      const prevItem = prevArray[prevIndex];
      const prevId = key ? (prevItem as MapObject)[key] : prevItem;

      if (nextMap.get(prevId) !== undefined) continue; // skip if NEXT_INDEX_DEFINED

      if (nextIndexesToAdd.has(prevIndex)) {
        nextIndexesToAdd.delete(prevIndex);
        const nextItem = nextArray[prevIndex];
        const nextId = key ? (nextItem as MapObject)[key] : nextItem;
        // * replace
        replace(prevIndex, nextItem);
        prevArray[prevIndex] = nextItem;
        // prevMap.delete(prevId);
        // prevMap.set(nextId, prevIndex);
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

      // prevMap.delete(prevId);
      prevLength --;
    }

    prevLength ++; // end deletions <<<

    // 4. Insert/push items

    for (const nextIndex of nextIndexesToAdd) { // O(add)
      const nextItem = nextArray[nextIndex];
      const nextId = key ? (nextItem as MapObject)[key] : nextItem;

      if (nextIndex < prevLength) {
        // * insert
        insert(nextIndex, nextItem);
        prevArray.splice(nextIndex, 0, nextItem);
      }
      else {
        // * push
        push(nextItem);
        prevArray.push(nextItem);
      }

      // prevMap.set(nextId, nextIndex);
      prevLength ++;
    };

    // 5. Swap items

    const swapRecursive = (prevItem: Item, prevIndex: number) => {
      const prevId = key ? (prevItem as MapObject)[key] : prevItem;
      const nextIndex = nextMap.get(prevId) as number; // NEXT_INDEX_DEFINED

      if (nextIndex === prevIndex) return;

      const nextItem = prevArray[nextIndex]; // ! get from prevArray !
      // const nextId = key ? (nextItem as MapObject)[key] : nextItem;

      // * swap
      swap(prevIndex, nextIndex);
      prevArray[prevIndex] = nextItem;
      prevArray[nextIndex] = prevItem;
      // prevMap.set(prevId, nextIndex);
      // prevMap.set(nextId, prevIndex);

      swapRecursive(prevArray[prevIndex], prevIndex); // O(swap)
    };

    prevArray.forEach(swapRecursive); // O(next) - by now, prevArray has nextArray length
  };
};

// todo
// interface ApplyProps <Item> {
//   remove: (index: number) => void;
//   insert: IndexItemAction<Item>; // insert new item to array at the index position
//   // * optimisation actions:
//   pop: () => void; // remove last item from the end of array
//   push: (item: Item) => void; // insert item at the end of array
//   replace: IndexItemAction<Item>; // replace item with a new item at the index position
//   swap: (prevIndex: number, nextIndex: number) => void; // swap items from prev index to the next index position
//   // * initial state
//   targetArray?: Item[]; // ! will be mutated !
// }

// const applyDiff = <Item> (targetArray: Item[]) => {

// };

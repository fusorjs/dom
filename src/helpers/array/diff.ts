
export interface IndexItemAction <Item> {
  (index: number, item: Item): void;
}

export type PrevMap <Item> = Map<Item, number>;

interface DiffProps <Item> {
  // * data
  prevArray: Item[]; // ! will be mutated, original array
  nextArray: readonly Item[]; // the other array to compare with the original array
  // * highest priority actions:
  remove: (index: number) => void; // remove item from array at the index position
  insert: IndexItemAction<Item>; // insert new item to array at the index position
  // * optimisation actions:
  pop: () => void; // remove last item from the end of array
  push: (item: Item) => void; // insert item at the end of array
  replace: IndexItemAction<Item>; // replace item with a new item at the index position
  swap: (prevIndex: number, nextIndex: number) => void; // swap items from prev index to the next index position
  // * key & update action
  key?: string; // name for id field, if set requires update field
  update?: IndexItemAction<Item>; // update item data with the same key
  // * cache
  prevMap?: PrevMap<Item>; // ! will be mutated, prev key index
  // todo count {cycle, remove, insert, pop, push, replace, swap, update} // ! will be mutated
}

// todo createDiff = (...) => (nextArray) => counters

// Find differences between two arrays.
// Calls corresponding actions for each difference.
// Mutates prevArray to match nextArray. Make a copy if you need to keep the original value.
// Do not forget to check if (prevArray !== nextArray) before calling this function.
// O(next*2 + prev + (prev) + (add - delete) + swap), Map(prev key index), Map(next key index), Set(index to add)
// return Map(prev key index) | undefined
export const diff = <Item> ({
  prevArray, nextArray, prevMap,
  remove, insert, pop, push, replace, swap, key, update,
}: DiffProps<Item>) => {
  if (key && ! update) throw new RangeError(`no "update" property provided`); // UPDATE_DEFINED_WITH_KEY

  let prevLength = prevArray.length

  const givenPrevMap = prevMap;

  // * Create prev map or reuse the given one

  prevMap ??= new Map();

  if (prevMap.size === 0) {
    for (let prevIndex = 0; prevIndex < prevLength; prevIndex ++) { // O(prev)
      const prevItem = prevArray[prevIndex];
      const prevId = key ? (prevItem as MapObject)[key] : prevItem;

      if (prevMap.has(prevId)) throw new RangeError(`prevArray duplicate: ${prevId}`);

      prevMap.set(prevId, prevIndex);
    }
  }

  // ! Algorithm: the order of the following blocks is important !

  // ** 1. update next **

  const nextMap = new Map<Item, number>();
  const nextIndexesToAdd = new Set<number>();

  {
    const nextLength = nextArray.length;

    // Create next map, find items to add/update
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
          update!/* UPDATE_DEFINED_WITH_KEY */(prevIndex, nextItem);
          prevArray[prevIndex] = nextItem;
        }
      }
    }
  }

  if (! givenPrevMap) prevMap = undefined;

  // ** 2. replace/remove/pop previous in reverse **

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

      if (prevMap) {
        prevMap.delete(prevId);
        prevMap.set(nextId, prevIndex);
      }

      continue;
    }

    if (prevIndex < prevLength) {
      // * remove
      // ? investigate: replace if has items to add, could lead to more swaps
      remove(prevIndex);
      prevArray.splice(prevIndex, 1);

      if (prevMap) {
        // ! will require full reindex
        prevMap.clear();
        prevMap = undefined;
      }
    }
    else {
      // * pop
      pop();
      prevArray.pop();
    }

    if (prevMap) prevMap.delete(prevId);

    prevLength --;
  }

  prevLength ++; // end deletions <<<

  // ** 3. insert/push next **

  for (const nextIndex of nextIndexesToAdd) { // O(add)
    const nextItem = nextArray[nextIndex];
    const nextId = key ? (nextItem as MapObject)[key] : nextItem;

    if (nextIndex < prevLength) {
      // * insert
      insert(nextIndex, nextItem);
      prevArray.splice(nextIndex, 0, nextItem);

      if (prevMap) {
        // ! will require full reindex
        prevMap.clear();
        prevMap = undefined;
      }
    }
    else {
      // * push
      push(nextItem);
      prevArray.push(nextItem);
    }

    if (prevMap) prevMap.set(nextId, nextIndex);

    prevLength ++;
  };

  // ** 4. swap previous recursive **

  const swapRecursive = (prevItem: Item, prevIndex: number) => {
    const prevId = key ? (prevItem as MapObject)[key] : prevItem;
    const nextIndex = nextMap.get(prevId)!; // NEXT_INDEX_DEFINED

    if (nextIndex === prevIndex) return;

    const nextItem = prevArray[nextIndex]; // ! get from prevArray

    // * swap
    swap(prevIndex, nextIndex);
    prevArray[prevIndex] = nextItem;
    prevArray[nextIndex] = prevItem;

    if (prevMap) {
      const nextId = key ? (nextItem as MapObject)[key] : nextItem;

      prevMap.set(prevId, nextIndex);
      prevMap.set(nextId, prevIndex);
    }

    swapRecursive(prevArray[prevIndex], prevIndex); // O(swap)
  };

  prevArray.forEach(swapRecursive); // O(next) - by now, prevArray has nextArray length
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

import {arrayDiff, arrayCompare, ArrayDiffer} from './diff';

interface ActionSingle <Item> {
  type: 'replace-one';
  index: number;
  payload: Item;
}

interface ActionMultiple <Item> {
  type: 'append-many' | 'remove-many';
  index: number;
  length: number;
  payload: readonly Item[];
}

interface ActionInit <Item> {
  type: 'init-all';
  payload: readonly Item[];
}

interface ActionClear {
  type: 'clear-all';
}

type Action <Item> = ActionSingle<Item> | ActionMultiple<Item> | ActionInit<Item> | ActionClear;

export type Patch <Item> = Action<Item>[];

export const getArrayPatch = <Item> (
  prevItems?: readonly Item[],
  nextItems?: readonly Item[],
) => {
  const patch: Patch<Item> = [];

  if (prevItems && nextItems) {
    arrayDiff<Item>(
      arrayCompare<Item>((index, prevItem, nextItem) => {
        patch.push({type: 'replace-one', index, payload: nextItem});
      }),
      <ArrayDiffer<Item>>((index, length, prevItems, nextItems) => {
        patch.push({type: 'append-many', index, length, payload: nextItems});
      }),
      <ArrayDiffer<Item>>((index, length, prevItems, nextItems) => {
        patch.push({type: 'remove-many', index, length, payload: prevItems});
      }),
      prevItems,
      nextItems,
    );
  }
  else if (nextItems) {
    patch.push({type: 'init-all', payload: nextItems});
  }
  else if (prevItems) {
    patch.push({type: 'clear-all'});
  }

  return patch;
};

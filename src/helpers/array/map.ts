import {isLiteral} from '../utils';

interface KeyIndexMap {
  [key: string]: number;
}

export const getKeyIndexMap = <Item extends KeyMap>(
  key: string, items: readonly Item[], from: number = 0, length: number = items.length
) => {
  const map: KeyIndexMap = Object.create(null);

  for (let i = from; i < length; i ++) {
    const id = items[i][key];

    if (! isLiteral(id)) {
      throw new Error(`not literal key "${key}" in: ${items[i]}`);
    }

    map[id] = i;
  }

  return map;
};

import {stringify} from '../lib/stringify';

import {DEVELOPMENT} from '../share';

export const emptyAttribute = undefined;

export const convertAttribute = (
  value: any,
): string | typeof emptyAttribute => {
  const type = typeof value;

  if (type === 'number' && !Number.isNaN(value)) return String(value);

  switch (value) {
    case '': // ? maybe not
    case null:
    case false:
    case emptyAttribute:
      return emptyAttribute;
    case true:
      return '';
  }

  if (DEVELOPMENT) {
    switch (type) {
      case 'string':
        break;
      default:
        throw new TypeError(`invalid attribute: ${stringify(value)}`);
    }
  }

  return value;
};

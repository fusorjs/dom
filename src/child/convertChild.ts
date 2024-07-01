import {stringify} from '../lib/stringify';

import {DEVELOPMENT} from '../share';

export const emptyChild = '';

export const convertChild = (value: any): string => {
  const type = typeof value;

  if (type === 'number' && !Number.isNaN(value)) return String(value);

  switch (value) {
    case null:
    case true:
    case false:
    case undefined:
      return emptyChild;
  }

  if (DEVELOPMENT) {
    switch (type) {
      case 'string':
        break;
      default:
        throw new TypeError(`invalid child: ${stringify(value)}`);
    }
  }

  return value;
};

import {ChildUpdater} from '../../types';

const symbol = Symbol('CustomUpdater');

export const customUpdater = (f: ChildUpdater) => {
  (f as any)[symbol] = true;
  return f;
};

export const isCustomUpdater = (f: ChildUpdater) => (f as any)[symbol] === true;

import {ChildUpdater} from '../../types';

const symbol = Symbol('CustomUpdater');

export interface CustomUpdater extends ChildUpdater {
  [symbol]?: true;
}

export const customUpdater = (f: CustomUpdater) => {
  f[symbol] = true;
  return f;
};

export const isCustomUpdater = (f: CustomUpdater) => f[symbol] === true;

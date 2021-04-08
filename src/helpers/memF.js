import {areArraysEqualShallow} from './array/equal';

export const memF = f => {
  let prevArgs, prevResult;

  return (...nextArgs) => {
    if (prevArgs && areArraysEqualShallow(prevArgs, nextArgs))
      return prevResult;

    prevArgs = nextArgs;
    prevResult = f(...nextArgs);

    return prevResult;
  };
};

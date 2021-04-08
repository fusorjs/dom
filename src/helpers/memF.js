import {areArraysEqual} from './areEqual';

// todo first run case, for no args
export const memF = f => {
  let prevArgs, prevResult;

  return (...nextArgs) => {
    if (prevArgs && areArraysEqual(prevArgs, nextArgs))
      return prevResult;

    prevArgs = nextArgs;
    prevResult = f(...nextArgs);

    return prevResult;
  };
};

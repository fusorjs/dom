
const areArraysEqual = (a1, a2) => {
  const {length} = a1;

  if (length !== a2.length)
    return false;

  for (let i = 0; i < length; i ++)
    if (a1[i] !== a2[i])
      return false;

  return true;
}

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


export const areArraysEqual = (a: Array<unknown>, b: Array<unknown>) => {
  const {length} = a;

  if (length !== b.length)
    return false;

  for (let i = 0; i < length; i ++)
    if (a[i] !== b[i])
      return false;

  return true;
}

export const areObjectsEqual = (a: Record<any, unknown>, b: Record<any, unknown>) => {
  const aKeys = Object.keys(a);
  const {length} = aKeys;

  if (Object.keys(b).length !== length)
    return false;

  for (let i = 0; i < length; i ++) {
    const key = aKeys[i];

    if (a[key] !== b[key])
      return false;
  }

  return true;
}

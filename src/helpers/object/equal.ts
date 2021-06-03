
// Do not forget to check if (a !== b) before calling this function.
export const areObjectsEqualShallow = (a: Record<any, unknown>, b: Record<any, unknown>) => {
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


export const pair = <T>(acc: [T, T][], v: T, i: number, arr: readonly T[]) => {
  if (i % 2 === 0) acc.push(arr.slice(i, i + 2) as [T, T]);
  return acc;
}

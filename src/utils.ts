
// pure inline
export const evaluate = (callback: Function): any => {
  let value = callback();

  // faster than recursion
  for (let i = 1; typeof value === 'function'; i ++) {
    if (i === 5) throw new TypeError(`preventing indefinite callback: ${i + 1}`);
    value = value();
  }

  return value;
};

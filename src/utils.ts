export const createTaggedMap = <M, K extends keyof M>(
  tagNames: readonly K[],
  tagComponent: (tagName: K) => M[K],
) => {
  const tags: M = {} as M;

  for (const name of tagNames) {
    tags[name] = tagComponent(name);
  }

  return tags;
};

export type Evaluable<T> = () => T | (() => Evaluable<T>);

/** evaluate functional expression (conditions, dynamic) */
export const evaluate = <T>(callback: Evaluable<T>): T => {
  let value = callback();

  // faster than recursion
  for (let i = 1; typeof value === 'function'; i++) {
    if (i === 5)
      throw new TypeError(`preventing indefinite callback: ${i + 1}`);
    value = (value as Evaluable<T>)();
  }

  return value;
};

export const isDevelopment =
  process?.env?.NODE_ENV?.trim().toLowerCase() === 'development';

/** human readable representation of any value
 *
 * should not be fast as it is used in throw for error messages
 */
export const stringify = (value: any): string => {
  switch (typeof value) {
    case 'string':
    case 'object':
      return JSON.stringify(value);
    default:
      return String(value);
  }
};

/** Get string value of anything. */
export const getString = (value: any) =>
  typeof value === 'object' ? JSON.stringify(value) : String(value);

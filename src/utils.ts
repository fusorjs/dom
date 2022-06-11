import {Component} from './element';
import {Evaluable, Evaluated} from './types';

export const ObjectIs = Object.is;

export const DEBUG =
  process?.env?.NODE_ENV?.trim().toLowerCase() !== 'production';

/** evaluate functional expression (conditions, dynamic) */
export const evaluate = <T>(callback: Evaluable<T>): Evaluated<T> => {
  let value = callback();

  // faster than recursion
  for (let i = 1; typeof value === 'function'; i++) {
    if (i === 5)
      throw new TypeError(`evaluation limit has been reached: ${i + 1}`);

    value = (value as Evaluable<T>)();
  }

  return value as Evaluated<T>;
};

/** get any value, evaluate first if it is a function */
// export const getValue = <T>(value: T): Evaluated<T> => {
//   return typeof value === 'function' ? evaluate(value) : value;
// };

/** Get string value of anything. */
export const getString = (value: any): string => {
  if (typeof value === 'object') {
    if (value instanceof Element) return value.outerHTML;

    if (value instanceof Component) return value.element.outerHTML;

    if (Array.isArray(value)) {
      return `[${value.map(stringify).join(',')}]`; // [() => 5] -> [() => 5]
    }

    if (value === null) return 'null';

    return `{${Object.entries(value).map(stringifyField).join(',')}}`;

    // return JSON.stringify(value); // [() => 5] -> [null]
  }

  return String(value);
};

/** Human readable representation of any value */
export const stringify = (value: any): string => {
  if (typeof value == 'string') return `"${value}"`;
  else return getString(value);
};

const stringifyField = ([k, v]: [string, any]) => `"${k}":${stringify(v)}`;

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

/** one pass through arrays */
// export const quickArrayDiff = <T>(
//   prev: readonly T[],
//   next: readonly T[],
//   compare: (index: number, prev: T, next: T) => void,
//   append: (index: number, next: T) => void,
//   remove: (index: number, prev: T) => void,
// ) => {
//   const prevLen = prev.length;
//   const nextLen = next.length;

//   let i = 0;

//   // compare
//   for (const minLen = Math.min(prevLen, nextLen); i < minLen; i++) {
//     compare(i, prev[i], next[i]);
//   }

//   // append
//   for (; i < nextLen; i++) {
//     append(i, next[i]);
//   }

//   // remove
//   for (; i < prevLen; i++) {
//     remove(i, prev[i]);
//   }
// };

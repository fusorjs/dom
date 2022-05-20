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
      throw new TypeError(`preventing indefinite callback: ${i + 1}`);

    value = (value as Evaluable<T>)();
  }

  return value as Evaluated<T>;
};

/** Get string value of anything. */
export const getString = (value: any) => {
  if (typeof value === 'object') {
    if (value instanceof Element) return value.outerHTML;
    else if (value instanceof Component) return value.getElement().outerHTML;
    else return JSON.stringify(value);
  }

  return String(value);
};

/** Human readable representation of any value */
export const stringify = (value: any) => {
  if (typeof value == 'string') return `"${value}"`;
  else return getString(value);
};

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

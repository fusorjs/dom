import {Component} from './component';

export const globalName = 'fusorjs';
export const elementExtrasName = ('_' + globalName) as '_fusorjs';

// ? do we need it if we compare strings ?
export const ObjectIs = Object.is;

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

export const getPropertyDescriptor = (
  value: any,
  property: string,
): PropertyDescriptor | undefined => {
  let result;

  do result = Object.getOwnPropertyDescriptor(value, property);
  while (!result && (value = Object.getPrototypeOf(value)));

  return result;
};

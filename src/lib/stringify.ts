import {Component} from '../component';

const stringifyField = ([k, v]: [string, any]) => `"${k}":${stringify(v)}`;

/** Human readable representation of any value */
export const stringify = (value: any): string => {
  switch (typeof value) {
    case 'string':
      return `"${value}"`;

    case 'object':
      if (value instanceof Component)
        return `Component(${value.element.outerHTML})`;

      if (Array.isArray(value)) return `[${value.map(stringify).join()}]`;

      if (value instanceof Node) {
        if (value instanceof Text) return `Text(${value.nodeValue})`;
        if (value instanceof Element) return value.outerHTML;
      }

      if (value !== null)
        return `{${Object.entries(value).map(stringifyField).join()}}`;
  }

  return String(value);
};

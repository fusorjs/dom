import {ChildCache} from '../types';
import {Component} from '../component';

import {convertChild} from './convertChild';
import {replaceChild} from './replaceChild';

export const replaceChildren = (
  element: Node,
  /** @mutated */
  cache: ChildCache[], // ! mutated
  nextValues: readonly any[],
  terminator: Text,
): void => {
  const prevLength = cache.length;
  const nextLength = nextValues.length;
  const minLength = Math.min(prevLength, nextLength);

  let i = 0;

  // compare
  for (; i < minLength; i++) {
    let nextValue = nextValues[i];

    // ? maybe apply nested arrays ?

    if (typeof nextValue === 'function') nextValue = nextValue();

    replaceChild(element, cache[i], nextValue);
  }

  // either remove
  if (i < prevLength) {
    const start = i;

    do {
      element.removeChild(cache[i].node);
      i++;
    } while (i < prevLength);

    cache.splice(start); // ! delete last after all other computations
  }

  // or insert
  for (; i < nextLength; i++) {
    let value = nextValues[i];

    // ? maybe apply nested arrays ?

    if (typeof value === 'function') value = value();

    let node: Node;

    if (value instanceof Node) {
      node = value;
    } else if (value instanceof Component) {
      node = value.element;
    } else {
      value = convertChild(value);
      node = new Text(value);
    }

    element.insertBefore(node, terminator);

    cache.push({
      value,
      node,
    });
  }
};

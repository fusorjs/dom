import {ChildCache} from '../types';
import {Component} from '../component';
import {ObjectIs} from '../share';

import {convertChild} from './convertChild';

const moved = Symbol('MovedChildCache');

export const replaceChildren = (
  element: Node,
  cache: ChildCache[], // ! mutated
  nextValues: readonly any[],
  terminator: Text,
): void => {
  const prevLength = cache.length;
  const nextLength = nextValues.length;
  const minLength = Math.min(prevLength, nextLength);
  const trackNodes = new Set<Node>();

  let i = 0;

  // compare
  for (; i < minLength; i++) {
    let nextValue = nextValues[i];

    // ? maybe apply nested arrays ?

    if (typeof nextValue === 'function') nextValue = nextValue();

    const _cache = cache[i];
    const {value: prevValue, node: prevNode} = _cache;

    if (ObjectIs(nextValue, prevValue)) {
      // trackNodes.add(prevNode);
      continue;
    }

    // ---

    let nextNode: Node | undefined;

    if (nextValue instanceof Node) {
      nextNode = nextValue;
    } else if (nextValue instanceof Component) {
      nextNode = nextValue.element;
    }

    if (nextNode) {
      if (trackNodes.has(prevNode)) {
        element.insertBefore(nextNode, terminator);
        // todo check if it always the last and if so maybe track just its position
      } else {
        element.replaceChild(nextNode, prevNode);
      }

      trackNodes.add(nextNode);
      _cache.value = nextValue;
      _cache.node = nextNode;

      continue;
    }

    // ---

    // todo optimize: check if there are same value in cache and reuse its node

    nextValue = convertChild(nextValue);

    if (nextValue === prevValue) {
      // trackNodes.add(prevNode);
      continue;
    }

    // ---

    nextNode = new Text(nextValue);
    element.replaceChild(nextNode, prevNode);
    // trackNodes.add(nextNode);

    _cache.value = nextValue;
    _cache.node = nextNode;
  }

  // either remove
  if (i < prevLength) {
    const start = i;

    do {
      const {node} = cache[i];
      if (!trackNodes.has(node)) element.removeChild(node);
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

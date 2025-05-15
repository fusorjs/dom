import {Child_, ChildCache} from '../types';
import {Component} from '../component';
import {ObjectIs} from '../share';

import {convertChild} from './convertChild';

// todo optimize insert & delete (note we rarely swap places), maybe only for keyed children
// abcd  acd
// acd   abcd
// del   ins

export const replaceChildren = (
  element: Node,
  caches: ChildCache[], // ! mutated
  children: readonly Child_[],
  terminator: Text,
): void => {
  const cacheLength = caches.length;
  const childLength = children.length;
  const minLength = Math.min(cacheLength, childLength);
  const trackNodes = new Set<Node>();

  let index = 0;

  // compare
  for (; index < minLength; index++) {
    let child = children[index];

    if (typeof child === 'function') child = (child as () => Child_)();

    // todo apply nested arrays

    const cached = caches[index];
    const {value: cachedValue, node: cachedNode} = cached;

    if (ObjectIs(child, cachedValue)) continue; // todo is this correct without convertChild?

    // ---

    let node: Node | undefined;

    if (child instanceof Node) {
      node = child;
    } else if (child instanceof Component) {
      node = child.element;
    }

    if (node) {
      if (trackNodes.has(cachedNode)) {
        element.insertBefore(node, terminator);
        // todo check if it always the last and if so maybe track just its position
      } else {
        element.replaceChild(node, cachedNode);
      }

      trackNodes.add(node);
      cached.value = child as any as Node | Component<any>;
      cached.node = node;

      continue;
    }

    // ---

    // todo optimize: check if there are same value in cache and reuse its node

    const value = convertChild(child);

    if (value === cachedValue) continue;

    // ---

    node = new Text(value);
    element.replaceChild(node, cachedNode);

    cached.value = value;
    cached.node = node;
  }

  // either remove
  if (index < cacheLength) {
    const start = index;

    do {
      const {node} = caches[index];
      if (!trackNodes.has(node)) element.removeChild(node);
      index++;
    } while (index < cacheLength);

    caches.splice(start); // ! delete last after all other computations
  }

  // or insert
  for (; index < childLength; index++) {
    let child = children[index];

    if (typeof child === 'function') child = (child as () => Child_)();

    // todo apply nested arrays

    let node: Node;

    if (child instanceof Node) {
      node = child;
    } else if (child instanceof Component) {
      node = child.element;
    } else {
      child = convertChild(child) as any;
      node = new Text(child as any as string);
    }

    element.insertBefore(node, terminator);

    caches.push({
      value: child as any as ChildCache['value'],
      node,
    });
  }
};

import {ChildCache, SingleChild, ValueNode} from '../types';
import {Component} from '../component';
import {ObjectIs, getString} from '../share';

import {convertChild} from './share';

/** Replace child value and update the cache if needed. */
export const replaceChild = (
  element: Node,
  /** This object mutated in this function! */
  cache: ChildCache, // ! mutated
  nextValue: SingleChild,
): void => {
  const {value: prevValue, node: prevNode} = cache;

  // same value, do nothing
  if (ObjectIs(nextValue, prevValue)) return;

  let nextNode: ValueNode | undefined;

  // replace with different element
  if (nextValue instanceof Element) {
    element.replaceChild(nextValue, prevNode);
    nextNode = nextValue;
  }

  // replace with different component's element
  else if (nextValue instanceof Component) {
    nextNode = nextValue.element;
    element.replaceChild(nextNode, prevNode);
  }

  // stringify value
  else {
    nextValue = getString(convertChild(nextValue));

    if (nextValue === prevValue) return; // check again after stringifying

    // replace value reusing text node
    if (prevNode instanceof Text) {
      prevNode.nodeValue = nextValue;
      nextNode = prevNode;
    }

    // replace with new text node
    else {
      nextNode = new Text(nextValue);
      element.replaceChild(nextNode, prevNode);
    }
  }

  // update cache
  cache.value = nextValue;
  cache.node = nextNode;
};

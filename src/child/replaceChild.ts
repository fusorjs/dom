import {ObjectIs} from '../share';
import {ChildCache} from '../types';
import {Component} from '../component';

import {convertChild} from './convertChild';

export const replaceChild = (
  element: Node,
  cache: ChildCache, // ! mutated
  nextValue: any,
): void => {
  const {value: prevValue, node: prevNode} = cache;

  // same value, do nothing
  if (ObjectIs(nextValue, prevValue)) return;

  let nextNode: Node;

  // replace with different element
  if (nextValue instanceof Node) {
    element.replaceChild(nextValue, prevNode);
    nextNode = nextValue;
  }

  // replace with different component's element
  else if (nextValue instanceof Component) {
    nextNode = nextValue.element;
    element.replaceChild(nextNode, prevNode);
  }

  // replace with string or number
  else {
    nextValue = convertChild(nextValue);

    if (nextValue === prevValue) return; // check again after converting

    // ! do not mutate Text as it might be used in client code
    // // replace value reusing text node
    // if (prevNode instanceof Text) {
    //   prevNode.nodeValue = nextValue;
    //   nextNode = prevNode;
    // }

    // replace with new text node
    nextNode = new Text(nextValue);
    element.replaceChild(nextNode, prevNode);
  }

  // update cache
  cache.value = nextValue;
  cache.node = nextNode;
};

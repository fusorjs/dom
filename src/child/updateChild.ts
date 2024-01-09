import {
  UpdatableChild,
  SingleChild,
  ChildCache,
  UpdatableChildren,
} from '../types';

import {replaceChild} from './replaceChild';
import {replaceChildren} from './replaceChildren';

export const updateChild = (
  element: Node,
  /** This object mutated in this function! */
  updatable: UpdatableChild | UpdatableChildren, // ! mutated
): void => {
  const {update, cache, terminator: prevTerminator} = updatable;
  const nextValue = update();

  const isPrevArray = Array.isArray(cache);
  const isNextArray = Array.isArray(nextValue);

  // replace children with children
  if (isNextArray && isPrevArray) {
    if ((updatable as UpdatableChildren).arrayRef === nextValue) return; // ? remove in v3 ?

    (updatable as UpdatableChildren).arrayRef = nextValue;
    replaceChildren(element, cache, nextValue, prevTerminator as Text);
  }

  // replace child with children
  else if (isNextArray) {
    let nextTerminator;

    if (prevTerminator) {
      nextTerminator = prevTerminator;
    } else {
      nextTerminator = element.insertBefore(
        new Text(),
        (cache as ChildCache).node.nextSibling,
      );
      (updatable as UpdatableChildren).terminator = nextTerminator;
    }

    (updatable as UpdatableChildren).arrayRef = nextValue;

    const nextCache = [cache as ChildCache];

    replaceChildren(element, nextCache, nextValue, nextTerminator); // todo optimize only insert children
    updatable.cache = nextCache;
  }

  // replace children with child
  else if (isPrevArray) {
    // ! keep terminator for future use
    (updatable as UpdatableChild).arrayRef = null;
    replaceChildren(
      element,
      cache,
      [
        nextValue as SingleChild, // todo as
      ],
      prevTerminator as Text,
    ); // todo optimize only remove children
    updatable.cache = cache[0];
  }

  // replace child with child
  else {
    replaceChild(element, cache, nextValue as SingleChild);
  }
};

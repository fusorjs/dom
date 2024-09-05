import {stringify} from './lib/stringify';

import {Fusion} from './types';
import {DEVELOPMENT} from './share';
import {Component} from './component';

// ? rename to getNode
/** Get DOM Element */
export const getElement = <E extends Element>(value: Fusion<E>): E => {
  if (DEVELOPMENT) {
    if (!(value instanceof Element || value instanceof Component))
      throw new TypeError(`does not have an element: ${stringify(value)}`);
  }

  return value instanceof Component ? value.element : value;
};

/** Is DOM Element updatable? */
export const isUpdatable = (value: Fusion): boolean => {
  return value instanceof Component;
};

/** Update DOM Element
 * @returns self
 */
export const update = <E extends Element>(value: Fusion<E>): Fusion<E> => {
  if (DEVELOPMENT && !isUpdatable(value))
    throw new TypeError(`not updatable: ${stringify(value)}`);

  return (value as Component<E>).update();
};

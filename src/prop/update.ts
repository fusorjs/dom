import {UpdatableProp} from '../types';
import {getString, ObjectIs} from '../utils';

import {convertAttr, emptyAttr} from './share';

export const updateProp = (
  element: Element,
  key: string,
  updatable: UpdatableProp,
) => {
  const {update, value: prevValue, isAttr, namespace} = updatable;
  const nextValue = isAttr ? convertAttr(update()) : update();

  // same value do nothing
  if (ObjectIs(nextValue, prevValue)) return;

  updatable.value = nextValue;

  if (isAttr) {
    // todo use createAttribute
    if (namespace === undefined) {
      if (nextValue === emptyAttr) element.removeAttribute(key);
      else element.setAttribute(key, getString(nextValue));
    } else {
      if (nextValue === emptyAttr) element.removeAttributeNS(namespace, key);
      else element.setAttributeNS(namespace, key, getString(nextValue));
    }
  } else {
    element[key as 'id'] = nextValue as any;
  }
};

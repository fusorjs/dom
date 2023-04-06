import {UpdatableProp} from '../types';
import {getString, ObjectIs} from '../utils';

import {convertAttr, emptyAttr} from './share';

export const updateProp = (
  element: Element,
  key: string,
  updatable: UpdatableProp,
) => {
  const {update, value: prevValue, isAttr} = updatable;
  const nextValue = isAttr ? convertAttr(update()) : update();

  // same value do nothing
  if (ObjectIs(nextValue, prevValue)) return;

  updatable.value = nextValue;

  if (isAttr) {
    // todo NS https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
    if (nextValue === emptyAttr) element.removeAttribute(key);
    else element.setAttribute(key, getString(nextValue));
  } else {
    element[key as 'id'] = nextValue as any;
  }
};

import {UpdatableProp} from '../types';
import {ObjectIs} from '../share';

import {convertAttribute, emptyAttribute} from './convertAttribute';

export const updateProp = (
  element: Element,
  key: string,
  updatable: UpdatableProp,
): void => {
  const {update, value: prevValue, isAttr, namespace} = updatable;
  let nextValue = update();

  // Attribute
  if (isAttr) {
    nextValue = convertAttribute(nextValue);

    if (nextValue === prevValue) return; // same value do nothing

    // todo use createAttribute
    // ! namespace can be null - https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
    if (namespace === undefined) {
      if (nextValue === emptyAttribute) element.removeAttribute(key);
      else element.setAttribute(key, nextValue as string);
    } else {
      if (nextValue === emptyAttribute)
        element.removeAttributeNS(namespace, key);
      else element.setAttributeNS(namespace, key, nextValue as string);
    }
  }
  // Property
  else {
    if (ObjectIs(nextValue, prevValue)) return; // same value do nothing

    element[key as 'id'] = nextValue as any;
  }

  updatable.value = nextValue;
};

import {DynamicChild, SingleChild} from '../types';
import {initChild} from './init';

export const initChildFlatten = <E extends Element>(
  element: E,
  childValue: any,
  dynamicChildren: DynamicChild<Element>[],
) => {
  // init array of children
  if (Array.isArray(childValue)) {
    for (const val of childValue) {
      initChildFlatten(element, val, dynamicChildren);
    }
  }

  // init single child
  else {
    const dynamicChild = initChild(element, childValue as SingleChild);

    if (dynamicChild) {
      dynamicChildren.push(dynamicChild);
    }
  }
};

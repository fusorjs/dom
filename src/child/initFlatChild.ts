import {DynamicChild, SingleChild} from '../types';
import {initChild} from './initChild';

export const initFlatChild = <E extends Element>(
  element: E,
  childValue: any,
  dynamicChildren: DynamicChild<Element>[],
) => {
  // init array of children
  if (Array.isArray(childValue)) {
    // todo DEVELOPMENT depth < 5
    for (const val of childValue) {
      initFlatChild(element, val, dynamicChildren);
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

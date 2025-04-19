import {
  DynamicChild,
  DynamicProps,
  ElementWithExtras,
  Fusion,
  Prop,
  SingleChild,
} from './types';
import {elementExtrasName} from './share';
import {Component} from './component';
import {initProp} from './prop/initProp';
import {initChild} from './child/initChild';

const initFlatChild = <E extends Element>(
  element: E,
  childValue: any,
  dynamicChildren?: DynamicChild<Element>[], // ! mutated
) => {
  // init array of children
  if (Array.isArray(childValue)) {
    // todo DEVELOPMENT depth < 5
    for (const val of childValue) {
      dynamicChildren = initFlatChild(element, val, dynamicChildren);
    }
  }

  // init single child
  else {
    const dynamicChild = initChild(element, childValue as SingleChild);

    if (dynamicChild) {
      dynamicChildren ||= [];
      dynamicChildren.push(dynamicChild);
    }
  }

  return dynamicChildren;
};

export const init = (
  element: ElementWithExtras,
  args: readonly unknown[],
): Fusion => {
  const {length} = args;

  if (length === 0) return element; // static

  let dynamicProps: DynamicProps | undefined;
  let dynamicChildren: DynamicChild<Element>[] | undefined;

  for (let index = 0; index < length; index++) {
    const arg = args[index];

    // init props
    if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        // JSX compatibility
        if (key === 'children') {
          dynamicChildren = initFlatChild(element, val, dynamicChildren);
          continue;
        }

        const dynamicProp = initProp(element, key, val as Prop);

        if (dynamicProp) {
          if (dynamicProps) dynamicProps[key] = dynamicProp;
          else dynamicProps = {[key]: dynamicProp};
        }
      }
    }

    // init child
    else {
      dynamicChildren = initFlatChild(element, arg, dynamicChildren);
    }
  }

  if (dynamicChildren && dynamicChildren.length === 0)
    dynamicChildren = undefined;

  // * Static Element

  if (!(dynamicProps || dynamicChildren)) return element;

  // * Dynamic Component

  const component = new Component(element, dynamicProps, dynamicChildren);
  const extras = element[elementExtrasName];

  if (extras) extras.component = component;
  else {
    element[elementExtrasName] = {
      component,
    };
  }

  return component;
};

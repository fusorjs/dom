import {DynamicChild, DynamicProps, FnInitter, Prop} from './types';
import {elementExtrasName} from './share';
import {Component} from './component';
import {initProp} from './prop/initProp';
import {initFlatChild} from './child/initFlatChild';

export const init: FnInitter = (element, args) => {
  const {length} = args;

  if (length === 0) return element; // static

  let dynamicProps: DynamicProps | undefined;
  let dynamicChildren: DynamicChild<Element>[] | undefined = [];

  for (let index = 0; index < length; index++) {
    const arg = args[index];

    // init props
    if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        if (key === 'children') {
          // for compatibility with JSX
          initFlatChild(element, val, dynamicChildren);
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
      initFlatChild(element, arg, dynamicChildren);
    }
  }

  if (dynamicChildren.length === 0) dynamicChildren = undefined;

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

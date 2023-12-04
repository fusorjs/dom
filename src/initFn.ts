import {DynamicChild, Prop, DynamicProps, FnInitter} from './types';
import {initProp} from './prop/init';
import {Component} from './component';
import {initChildFlatten} from './child/initFlatten';
import {elementComponent} from './element-component';

export const initFn: FnInitter = (element, args) => {
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
          initChildFlatten(element, val, dynamicChildren);
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
      initChildFlatten(element, arg, dynamicChildren);
    }
  }

  if (dynamicChildren.length === 0) dynamicChildren = undefined;

  // * Static Element

  if (!(dynamicProps || dynamicChildren)) return element;

  // * Dynamic Component

  const component = new Component(element, dynamicProps, dynamicChildren);

  elementComponent.set(element, component);

  return component;
};

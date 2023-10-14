import {DynamicChild, Prop, DynamicProps, FnInitter} from './types';
import {initProp} from './prop/init';
import {Component} from './component';
import {initChildFlatten} from './child/initFlatten';

export class Options {
  constructor(readonly options: ElementCreationOptions) {}
}

export const initFn: FnInitter = (element, args) => {
  let dynamicProps: DynamicProps | undefined;
  let dynamicChildren: DynamicChild<Element>[] | undefined = [];

  const {length} = args;

  for (let index = 0; index < length; index++) {
    const arg = args[index];

    // skip options
    if (arg instanceof Options) {
      // ! Do not throw, as arrays could be reused, so we won't have to mutate/re-create them !
      // if (index !== 0) throw new Error('Options must be a first child');
    }

    // init props
    else if (arg?.constructor === Object) {
      for (const [key, val] of Object.entries(arg)) {
        // for compatibility with JSX, use <Life> component in JSX instead of <fisor-life>
        if (key === 'children') {
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

  return dynamicProps || dynamicChildren
    ? new Component(element, dynamicProps, dynamicChildren) // dynamic
    : element; // static
};

import {DynamicChild, Prop, DynamicProps, SingleChild, Creator} from './types';
import {createProp} from './prop/create';
import {initChild} from './child';
import {Component} from './component';

export class Options {
  constructor(readonly options: ElementCreationOptions) {}
}

export const create: Creator = (element, args) => {
  let props: DynamicProps | undefined;
  let children: DynamicChild<Element>[] | undefined;

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
        const prop = createProp(element, key, val as Prop);

        if (prop) {
          if (props) props[key] = prop;
          else props = {[key]: prop};
        }
      }
    }

    // init children
    else if (Array.isArray(arg)) {
      for (const a of arg) {
        const child = initChild(element, a);

        if (child) {
          if (children) children.push(child);
          else children = [child];
        }
      }
    }

    // init child
    else {
      const child = initChild(element, arg as SingleChild);

      if (child) {
        if (children) children.push(child);
        else children = [child];
      }
    }
  }

  return props || children
    ? new Component(element, props, children) // dynamic
    : element; // static
};

import {
  DynamicChild,
  Prop,
  DynamicProps,
  SingleChild,
  Creator,
  SetCreatorConfig,
} from './types';
import {initProp, updateProp} from './prop';
import {initChild, updateChild} from './child';

export const create: Creator = (element, config, args) => {
  let {getPropConfig} = config;
  let props: DynamicProps | undefined;
  let children: DynamicChild<Element>[] | undefined;

  for (const arg of args) {
    // set config
    if (arg instanceof SetCreatorConfig) {
      ({getPropConfig} = arg.config);
    }

    // init props
    else if (arg?.constructor === Object) {
      for (const [_key, val] of Object.entries(arg)) {
        const {key, type} = getPropConfig(_key);
        const prop = initProp(element, key, val as Prop, type);

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

// todo split file here --/--

export class Component<E extends Element> {
  constructor(
    private _element: E,
    private props?: DynamicProps,
    private children?: readonly DynamicChild<E>[],
  ) {}

  get element() {
    return this._element;
  }

  update() {
    const {_element, props, children} = this;

    if (props) {
      for (const [key, prop] of Object.entries(props)) {
        updateProp(_element, key, prop);
      }
    }

    if (children) {
      for (const child of children) {
        if (child instanceof Component) child.update();
        else updateChild(_element, child);
      }
    }

    return this; // todo 2.0
  }
}

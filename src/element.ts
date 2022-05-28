import {
  DynamicChild,
  Prop,
  DynamicProps,
  SingleChild,
  Initiator,
} from './types';
import {initProp} from './prop';
import {initChild} from './child';
import {updateChild} from './child';
import {updateProp} from './prop';

export const initElement: Initiator = (element, args, getPropConfig) => {
  let props: DynamicProps | undefined;
  let children: DynamicChild<Element>[] | undefined;

  for (const arg of args) {
    // init props
    if (arg?.constructor === Object) {
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
        const child = initChild(element, a as SingleChild);

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

// elementary-js/dom-component
// dom-element-component
// DomElementUpdater
// DynamicElement
// Turbik
// Fusor
// TurboFusor DomFusor ElementFusor efusor
// fusion reactor

// todo 5 to config
export const RECURSION_LIMIT = 5;

export class Component<E extends Element> {
  constructor(
    private element: E,
    private props?: DynamicProps,
    private children?: readonly DynamicChild<E>[],
  ) {}

  // todo getter
  getElement() {
    return this.element;
  }

  update(recursion = RECURSION_LIMIT) {
    if (recursion < 1) {
      throw new Error(`update recursion limit has been reached`);
    }

    const {element, props, children} = this;

    if (props) {
      for (const [key, prop] of Object.entries(props)) {
        updateProp(element, key, prop);
      }
    }

    if (children) {
      for (const child of children) {
        if (child instanceof Component) child.update(recursion);
        else updateChild(element, child, recursion);
      }
    }
  }
}

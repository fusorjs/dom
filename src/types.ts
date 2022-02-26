import {updateChild} from './child';
import {updateProp} from './prop';

// export type some = string | number | boolean | symbol | object;
// export type StaticValue <T> = T extends Function ? never : T;

type Primitive = string | number | boolean | symbol | null | undefined;

export type StaticProp = Primitive;

type SingleStaticChild = Primitive | Element;

export type StaticChild = SingleStaticChild | Array<SingleStaticChild>;

interface StaticProps {
  [key: string]: StaticProp;
}
// todo event handlers should be static https://stackoverflow.com/q/71111120/7138254
// type EventName = `on${string}`;
// interface StaticProps2 {
//   // [key: string]: StaticProp;
//   // [key: `on${string}`]: Function;
//   [K: EventName | string]: typeof K extends EventName ? Function : StaticProp;
//   // [K: string]: typeof K extends EventName ? Function : StaticProp;
// }
// const xxx: StaticProps2 = {
//   asd: true,
//   onasd: () => {},
// };

export type StaticArg = StaticProps | StaticChild;

export type Prop = StaticProp | Function;

type SingleChild = SingleStaticChild | Function | Component<Element>;

export type Child = SingleChild | Array<SingleChild>;

interface Props {
  [key: string]: Prop;
}

export type Arg = Props | Child;

export type Updater = () => void;

export type Evaluable<T> = () => T | (() => Evaluable<T>); // todo remove function from result

export interface PropData {
  readonly update: Evaluable<StaticProp>;
  value: StaticProp;
}

export interface DynamicProps {
  [key: string]: PropData;
}

// todo type EvaluatedChild = SingleStaticChild | Component<Element>

export interface ChildData {
  readonly update: Evaluable<StaticChild>; // todo EvaluatedChild
  value: StaticChild;
  node: Element | Text;
}

export type DynamicChild<E extends Element> = ChildData | Component<E>;

// elementary-js/dom-component
// dom-element-component
// DomElementUpdater
// DynamicElement
export class Component<E extends Element> {
  constructor(
    private element: E,
    private props?: DynamicProps,
    private children?: readonly DynamicChild<E>[],
  ) {}

  getElement() {
    return this.element;
  }

  update() {
    const {element, props, children} = this;

    if (props) {
      for (const [key, data] of Object.entries(props)) {
        updateProp(element, key, data);
      }
    }

    if (children) {
      for (const i of children) {
        if (i instanceof Component) i.update();
        else updateChild(element, i);
      }
    }
  }
}

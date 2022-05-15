import {updateChild} from './child';
import {updateProp} from './prop';

// export type some = string | number | boolean | symbol | object;
// export type StaticValue <T> = T extends Function ? never : T;

export type Primitive = string | number | boolean | symbol | null | undefined;

export type StaticProp = Primitive;

export type SingleStaticChild = Primitive | Element;

export type StaticChild = SingleStaticChild | Array<SingleStaticChild>;

export interface StaticProps {
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

export type SingleChild = SingleStaticChild | Function | Component<Element>;

export type Child = SingleChild | Array<SingleChild>;

export interface Props {
  [key: string]: Prop;
}

export type Arg = Props | Child;

export type Updater = () => void;

export type Evaluable<T> = () => T | (() => Evaluable<T>);

export type Evaluated<T> = Exclude<T, Function>;

export interface UpdatableProp {
  readonly update: Evaluable<Prop>;
  value: Evaluated<Prop>;
}

export interface DynamicProps {
  [key: string]: UpdatableProp;
}

export type ValueNode = Text | Element;

export interface ChildCache {
  value: Evaluated<SingleChild>;
  node: ValueNode;
}

export interface UpdatableChild {
  readonly update: Evaluable<Child>;
  cache: ChildCache | ChildCache[];
}

// todo
// export type UpdatableChild = {
//   readonly update: Evaluable<Child>;
// } & (
//   | {
//       value: Evaluated<SingleChild>;
//       node: ValueNode;
//     }
//   | {
//       value: Evaluated<SingleChild[]>;
//       node: ValueNode[];
//     }
// );

export type DynamicChild<E extends Element> = UpdatableChild | Component<E>;

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
      for (const [key, prop] of Object.entries(props)) {
        updateProp(element, key, prop);
      }
    }

    if (children) {
      for (const child of children) {
        if (child instanceof Component) child.update();
        else updateChild(element, child);
      }
    }
  }
}

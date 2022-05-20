import {Component} from './element';

// -- ARGS --

// export type some = string | number | boolean | symbol | object;
// export type StaticValue <T> = T extends Function ? never : T;

export type Primitive = string | number | boolean | symbol | null | undefined;

export type StaticProp = Primitive;

export type SingleStaticChild = Primitive | Element;

export type StaticChild = SingleStaticChild | Array<SingleStaticChild>;

export interface StaticProps {
  [key: string]: StaticProp;
  // [kkey: `on${string}`]: Function;
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

// -- INIT --

export const enum PropType {
  ATTRIBUTE,
  PROPERTY,
  BUBBLING_EVENT,
  CAPTURING_EVENT,
}

export type GetPropConfig = (key: string) => {type: PropType; key: string};

export interface Initiator {
  <E extends Element>(
    element: E,
    args: readonly StaticArg[],
    getPropConfig: GetPropConfig,
  ): E;
  <E extends Element>(
    element: E,
    args: readonly Arg[],
    getPropConfig: GetPropConfig,
  ): Component<E>;
}

export interface Creator<E extends Element> {
  (...args: readonly StaticArg[]): E;
  (...args: readonly Arg[]): Component<E>;
}

export type Evaluable<T> = () => T | (() => Evaluable<T>);

export type Evaluated<T> = Exclude<T, Function>;

// -- UPDATE --

export interface UpdatableProp {
  readonly update: Evaluable<Prop>;
  value: Evaluated<Prop>;
  isAttr: boolean;
}

export interface DynamicProps {
  [key: string]: UpdatableProp;
}

export type ValueNode = Text | Element;

export type UpdatableChild = {
  readonly update: Evaluable<Child>;
} & (
  | {
      value: Evaluated<SingleChild>;
      node: ValueNode;
    }
  | {
      value: Evaluated<SingleChild[]>;
      node: ValueNode[];
    }
);

export type DynamicChild<E extends Element> = UpdatableChild | Component<E>;

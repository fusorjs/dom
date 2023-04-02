import {Component} from './element';

/* STATIC ARGS */

export type Primitive =
  | string
  | number
  | boolean
  | symbol
  | null
  | undefined
  | void;

export type StaticProp = Primitive;

export type SingleStaticChild = Primitive | Element; // ? deprecate ?

export type StaticChild = SingleStaticChild | SingleStaticChild[];

export interface StaticProps {
  [key: string]: StaticProp;
  // [kkey: `on${string}`]: Function; // todo event handlers should be static https://stackoverflow.com/q/71111120/7138254
}

export type StaticArg = StaticProps | StaticChild;

/* DYNAMIC ARGS */

export type Prop = StaticProp | ((...a: any) => any); //| EventHandler;

export type SingleChild =
  | SingleStaticChild
  | (() => Child)
  | Component<Element>;

export type Child = SingleChild | SingleChild[];

export interface Props {
  [key: string]: Prop;
}

export type Arg = Props | Child;

/* INIT */

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

/* UPDATE */

export interface UpdatableProp {
  readonly update: () => Prop;
  value: Prop;
  isAttr: boolean;
}

export interface DynamicProps {
  [key: string]: UpdatableProp;
}

export type ValueNode = Text | Element;

export interface ChildCache {
  value: Child; // ! not StaticChild
  node: ValueNode;
}

export interface UpdatableChild {
  readonly update: () => Child;
  cache: ChildCache;
}

export type UpdatableChildren = {
  readonly update: () => Child;
  arrayRef: Child[];
  cache: ChildCache[];
};

export type DynamicChild<E extends Element> =
  | UpdatableChild
  | UpdatableChildren
  | Component<E>;

/* EXPERIMENTS */

// export type some = string | number | boolean | symbol | object;
// export type StaticValue<T> = T extends Function ? never : T;

// export interface StaticProps2 {
//   [key: string]: StaticProp;
//   [kkey: `on${string}`]: Function;
// }
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

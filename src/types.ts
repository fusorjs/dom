import {Component} from './component';
import {Options} from './create';

/* STATIC ARGS */

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined
  | void;

export type StaticProp =
  | Primitive
  | readonly any[]
  // any object but function
  | {apply?: never; readonly [k: string]: any}
  | {call?: never; readonly [k: string]: any};

export type SingleStaticChild = Primitive | Element | Options; // ? deprecate ?

export type StaticChild = SingleStaticChild | readonly SingleStaticChild[];

export interface StaticProps {
  readonly [key: string]: StaticProp;
  // [kkey: `on${string}`]: Function; // todo event handlers should be static https://stackoverflow.com/q/71111120/7138254
}

export type StaticArg = StaticProps | StaticChild;

/* DYNAMIC ARGS */

export type Prop = StaticProp | ((...a: any) => any); //| EventHandler;

export type SingleChild =
  | SingleStaticChild
  | (() => Child)
  | Component<Element>;

export type Child = SingleChild | readonly SingleChild[];

export interface Props {
  readonly [key: string]: Prop;
}

export type Arg = Props | Child;

/* CREATORS */

export interface Creator {
  <E extends Element>(element: E, args: readonly StaticArg[]): E;
  <E extends Element>(element: E, args: readonly Arg[]): Component<E>;
}

export interface ElementCreator<E extends Element> {
  (
    namespace: string | undefined,
    tagName: string,
    args: readonly StaticArg[],
  ): E;
  (
    namespace: string | undefined,
    tagName: string,
    args: readonly Arg[],
  ): Component<E>;
}

export interface CustomCreator<E extends Element> {
  (tagName: string, ...args: readonly StaticArg[]): E;
  (tagName: string, ...args: readonly Arg[]): Component<E>;
}

export interface TaggedCreator<E extends Element> {
  (...args: readonly StaticArg[]): E;
  (...args: readonly Arg[]): Component<E>;
}

/* UPDATE */

export interface UpdatableProp {
  readonly update: () => Prop;
  value: Prop;
  isAttr: boolean;

  // todo not applicable to properties, split attr and prop
  namespace?: null | string; // ! undefined for HTMLElement only, without namespace
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

import {Component} from './component';
import {elementExtrasName} from './share';

export interface Distinct<Name> {
  __DISTINCT: Name;
}

export type NamespaceUri = string & Distinct<'NamespaceUri'>;
export type TagName = string & Distinct<'TagName'>;

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

export type SingleStaticChild = Primitive | Element;

export type StaticChild = SingleStaticChild | readonly SingleStaticChild[];

export interface StaticProps {
  readonly [key: string]: StaticProp;
  // [key: `{string}_e{string}`]: Function; // todo event handlers should be static https://stackoverflow.com/q/71111120/7138254
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

/* EXTRAS */

export type LifeUnmount = () => void;
export type LifeMount = (self?: Component<Element>) => LifeUnmount | undefined;

/** Internal api */
export interface ElementExtras {
  mount?: LifeMount;
  unmount?: LifeUnmount;
  component?: Component<Element>;
}

/** This is internal and could change (maybe to WeakMap)
 * @deprecated pass "extras" to custom-element constructor and to init functions
 */
export interface ElementWithExtras extends Element {
  [elementExtrasName]?: ElementExtras;
}

/* INITTERS */

export interface FnInitter {
  <E extends ElementWithExtras>(element: E, args: readonly StaticArg[]): E;
  <E extends ElementWithExtras>(element: E, args: readonly Arg[]): Component<E>;
}

export interface ElementInitter<E extends Element> {
  (
    namespace: NamespaceUri | undefined,
    tagName: TagName,
    args: readonly StaticArg[],
  ): E;
  (
    namespace: NamespaceUri | undefined,
    tagName: TagName,
    args: readonly Arg[],
  ): Component<E>;
}

export interface CustomInitter<E extends Element> {
  (tagName: string, ...args: readonly StaticArg[]): E;
  (tagName: string, ...args: readonly Arg[]): Component<E>;
}

export interface TaggedInitter<E extends Element> {
  (...args: readonly StaticArg[]): E;
  (...args: readonly Arg[]): Component<E>;
}

export interface JsxInitter<E extends Element> {
  (
    tagName: TagName | Function,
    props?: StaticProps,
    ...children: readonly StaticChild[]
  ): E;
  (
    tagName: TagName | Function,
    props?: Props,
    ...children: readonly Child[]
  ): Component<E>;
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
  value: string | Element | Component<Element>;
  node: ValueNode;
}

export interface UpdatableChild {
  readonly update: () => Child;
  cache: ChildCache;
  terminator: Text | null; // keep for performance
  arrayRef: null; // keep for performance
}

export type UpdatableChildren = {
  readonly update: () => Child;
  cache: ChildCache[];
  /** Empty node after the last array node (used for insertion before it if array is empty) */
  terminator: Text; // ! Comment will pollute innerHTML with "<!---->"
  arrayRef: Child[]; // ? remove in v3 ?
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
//   [kkey: `on_{string}`]: Function;
// }
// type EventName = `on_{string}`;
// interface StaticProps2 {
//   // [key: string]: StaticProp;
//   // [key: `on_{string}`]: Function;
//   [K: EventName | string]: typeof K extends EventName ? Function : StaticProp;
//   // [K: string]: typeof K extends EventName ? Function : StaticProp;
// }
// const xxx: StaticProps2 = {
//   asd: true,
//   onasd: () => {},
// };

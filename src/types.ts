import {Component} from './component';
import {elementExtrasName} from './share';

export interface Distinct<Name> {
  __DISTINCT: Name;
}

export type NamespaceUri = string & Distinct<'NamespaceUri'>; // ! null - https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
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

export type SingleStaticChild = Primitive | Node;

export type StaticChild = SingleStaticChild | readonly SingleStaticChild[];

export interface StaticProps {
  /** Custom element name. */
  is?: string;
  // mount?: Mount; // todo
  // [key: `${string}_e${string}`]: Function; // todo event handlers should be static https://stackoverflow.com/q/71111120/7138254
  readonly [key: string]: StaticProp;
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
  /** Custom element name. */
  is?: string;
  mount?: Mount;
  readonly [key: `${string}_e${string}`]:
    | EventListener2
    | EventListenerOrEventListenerObject2
    //?| null
    | AddEventListenerOptions2;
  readonly [key: string]: Prop;
}

export type Arg = Props | Child;

/* EVENTS */

export type EventListener2 = <EV extends Event>(
  // ? this: EL, // , EL extends Element
  event: EV,
  self: Fusion,
) => void;

export type EventListenerOrEventListenerObject2 =
  | EventListener2
  | {
      handleEvent: EventListener2;
    };

export type AddEventListenerOptions2 = AddEventListenerOptions & {
  update?: boolean;
  handle: EventListenerOrEventListenerObject2;
};

/* EXTRAS */

export type Unmount = () => void;
/** DOM Element connect callback. Return disconnect function if needed. */
export type Mount = (self: Fusion) => Unmount | undefined;

/** @internal */
export interface ElementExtras {
  mount?: Mount;
  unmount?: Unmount;
  component?: Component<Element>;
}

/** @internal */
export interface ElementWithExtras extends Element {
  [elementExtrasName]?: ElementExtras;
}

/* INITTERS */

// FusorNode, Entity, Matter, Component, Nucleus, Meld, Chunk, Block, Part, Piece, Segment, Unit, Structure, Item, Node, Creature, Fragment
/** Some unknown structure
 * @internal do not rely on its internal structure
 * Use public API method to work with it: update, isUpdatable, getElement */
export type Fusion = Element | Component<Element>;

export interface FnInitter {
  <E extends ElementWithExtras>(element: E, args: readonly StaticArg[]): E;
  <E extends ElementWithExtras>(element: E, args: readonly Arg[]): Component<E>;
}

export interface InitElementHelper {
  (
    namespace: NamespaceUri | undefined,
    tagName: TagName,
    args: readonly any[], // Arg[],
  ): Fusion;
}

export interface CustomInitter<E extends Element> {
  (tagName: string, ...args: readonly StaticArg[]): E;
  (tagName: string, ...args: readonly Arg[]): Component<E>;
}

export interface TaggedInitter<E extends Element> {
  (...args: readonly StaticArg[]): E;
  (...args: readonly Arg[]): Component<E>;
}

export interface InitJsx {
  (
    tagName: TagName | Function,
    props?: Props,
    ...children: readonly Child[]
  ): Fusion;
}

/* UPDATE */

// todo split to UpdatableProperty and UpdatableAttribute
export interface UpdatableProp {
  readonly update: () => Prop;
  value: Prop; // todo string for attribute
  isAttr: boolean;

  // todo not applicable to properties
  namespace?: null | string; // ! undefined for HTMLElement only, without namespace
}

export interface DynamicProps {
  [key: string]: UpdatableProp;
}

export interface ChildCache {
  value: string | Node | Component<Element>;
  node: Node;
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

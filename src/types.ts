import {Component} from './component';
import {elementExtrasName} from './share';

export interface Distinct<Name extends string> {
  __distinct: Name;
}

export type NameSpace = string & Distinct<'NameSpace'>; // ! can be null - https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
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

export type Prop = StaticProp | ((...a: unknown[]) => unknown); // todo Prop = unknown & distinct

export type SingleChild = SingleStaticChild | (() => Child) | Fusion;

export type Child = SingleChild | readonly SingleChild[]; // todo Child = unknown & distinct

declare global {
  namespace Fusor {
    type ParameterSeparator = '_';
  }
}

type ___ = Fusor.ParameterSeparator;

/** Element parameters: arguments, properties, event handlers */
export interface Params<E extends Element = Element> {
  is?: string;
  mount?: Mount<E>;
  readonly [key: `${string}${___}e`]: EL<E>;
  readonly [key: `${string}${___}e${___}${string}`]: EL<E>;
  readonly [key: string]: unknown; // Prop;
}

export type Arg<E extends Element = Element> = Params<E> | Child;

/* EVENTS */

// ? determine the event name and map to correct event type
// <HTMLElementEventMap>

/** Event listener function (resembles: EventListener) */
export type ELFunction<EL extends Element = Element> = <EV extends Event>(
  // ? this: EL,
  event: EV & {target: EL},
  self: Fusion<EL>,
) => void;

/** Event listener object (resembles: EventListenerObject) */
export type ELObject<E extends Element = Element> = {
  handleEvent: ELFunction<E>;
};

/** Event listener function or object (resembles: EventListenerOrEventListenerObject) */
export type ELFunctionOrObject<
  E extends Element = Element,
  O extends ELObject<E> = ELObject<E>,
> = ELFunction<E> | O;

/** Event listener options (resembles: AddEventListenerOptions) */
export type ELOptions<
  E extends Element = Element,
  O extends ELObject<E> = ELObject<E>,
> = AddEventListenerOptions & {
  update?: boolean;
  handle: ELFunctionOrObject<E, O>;
};

/** Event Listener */
export type EL<
  E extends Element = Element,
  O extends ELObject<E> = ELObject<E>,
> =
  | ELFunctionOrObject<E, O>
  //?| null
  | ELOptions<E, O>;

/* EXTRAS */

/** DOM Element connect callback. Return disconnect function if needed. */
export type Mount<E extends Element = Element> = (
  self: Fusion<E>,
) => Unmount | void;

/** DOM Element disconnect callback. */
export type Unmount = () => void;

/** @internal */
export interface ElementExtras {
  mount?: Mount;
  unmount?: ReturnType<Mount>;
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
export type Fusion<E extends Element = Element> = E | Component<E>;

export interface XMLInitter {
  (
    namespace: NameSpace | undefined,
    tag: TagName,
    args: readonly unknown[],
  ): Fusion;
}

export interface HyperNotation<Map extends {[key: string]: Element}> {
  <Tag extends keyof Map>(
    tag: Tag,
    ...args: readonly Arg<Map[Tag]>[]
  ): Fusion<Map[Tag]>;
}

export interface FunctionalNotation<E extends Element> {
  (...args: readonly Arg<E>[]): Fusion<E>;
}

export interface JsxFactory {
  (
    tagName: TagName | Function,
    props?: Params,
    ...children: readonly Child[]
  ): Fusion;
}

export interface JsxImportSource {
  (tagName: TagName | Function, props?: Params, key?: any): Fusion;
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

/* OTHER */

export type AllHTMLElementTagNameMap = HTMLElementTagNameMap &
  HTMLElementDeprecatedTagNameMap;

import {Primitive} from '@perform/common';

// export namespace Static {
// }

export type StaticProp = Primitive;

export type StaticChild = Primitive | Element;

export interface StaticProps {
  // [key: `on${string}`]: Function; // todo event handlers are should be static
  [key: string]: StaticProp;
}

export type StaticArg = StaticProps | StaticChild;

export type Prop = StaticProp | Function;

export type Child = StaticChild | Function;

export interface Props {
  [key: string]: Prop;
}

export type Arg = Props | Child;

/** Prop/Child updater */
export interface Updater {
  (): void;
}

export interface EventT <T extends EventTarget> extends Omit<Event, 'target'> {
  target: T;
}

export const elementSymbol = Symbol('elemetal');

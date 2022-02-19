import {updateProp} from './prop';

// export type some = string | number | boolean | symbol | object;
// export type StaticValue <T> = T extends Function ? never : T;

type Primitive = string | number | boolean | symbol | null | undefined;

export type StaticProp = Primitive;

type SingleStaticChild = Primitive | Element;

type StaticChild = SingleStaticChild | Array<SingleStaticChild>;

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

export type Evaluable<T> = () => T | (() => Evaluable<T>);

export interface PropData {
  readonly updater: Evaluable<StaticProp>;
  value: string | undefined;
}

export interface PropsDatas {
  [key: string]: PropData;
}

export type ChildUpdater<E extends Element> = Updater | Component<E>;

// elementary-js/dom-component
// dom-element-component
// DomElementUpdater
// DynamicElement
export class Component<E extends Element> {
  constructor(
    private element: E,
    private propsDatas?: PropsDatas,
    private childUpdaters?: readonly ChildUpdater<E>[],
  ) {}

  getElement() {
    return this.element;
  }

  update() {
    const {element, propsDatas, childUpdaters} = this;

    if (propsDatas) {
      for (const [key, data] of Object.entries(propsDatas)) {
        updateProp(element, key, data);
      }
    }

    if (childUpdaters) {
      for (const u of childUpdaters) {
        if (u instanceof Component) u.update();
        else u();
      }
    }
  }
}

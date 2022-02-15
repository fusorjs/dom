// export type some = string | number | boolean | symbol | object;
// export type StaticValue <T> = T extends Function ? never : T;

type Primitive = string | number | boolean | symbol | null | undefined;

type StaticProp = Primitive;

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

export interface PropsUpdaters {
  [key: string]: Updater;
}

export type ChildUpdater<E extends Element> = Updater | Component<E>;

// elementary-js/dom-component
// dom-element-component
// DomElementUpdater
// DynamicElement
export class Component<E extends Element> {
  constructor(
    private element: E,
    private propsUpdaters?: PropsUpdaters,
    private childUpdaters?: readonly ChildUpdater<E>[],
  ) {}

  getElement() {
    return this.element;
  }

  update() {
    const {propsUpdaters, childUpdaters} = this;

    if (propsUpdaters) {
      for (const u of Object.values(propsUpdaters)) {
        u();
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

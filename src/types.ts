// export type some = string | number | boolean | symbol | object;
// export type StaticValue <T> = T extends Function ? never : T;

type Primitive = string | number | boolean | symbol | null | undefined;

type StaticProp = Primitive;

type SingleStaticChild = Primitive | Element;

type StaticChild = SingleStaticChild | Array<SingleStaticChild>;

interface StaticProps {
  // [key: `on${string}`]: Function; // todo event handlers should be static
  [key: string]: StaticProp;
}

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

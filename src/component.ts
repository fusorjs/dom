import {DynamicChild, DynamicProps} from './types';
import {updateProp} from './prop/update';
import {updateChild} from './child';

export class Component<E extends Element> {
  constructor(
    private _element: E,
    private props?: DynamicProps,
    private children?: readonly DynamicChild<E>[],
  ) {}

  get element() {
    return this._element;
  }

  update() {
    const {_element, props, children} = this;

    if (props) {
      for (const [key, prop] of Object.entries(props)) {
        updateProp(_element, key, prop);
      }
    }

    if (children) {
      for (const child of children) {
        if (child instanceof Component) child.update();
        else updateChild(_element, child);
      }
    }

    return this;
  }
}

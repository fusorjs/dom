import {DynamicChild, DynamicProps} from './types';
import {updateProp} from './prop/update';
import {updateChild} from './child/child';

export class Component<E extends Element> {
  constructor(
    private element_: E,
    private props?: DynamicProps,
    private children?: readonly DynamicChild<E>[],
  ) {}

  get element() {
    return this.element_;
  }

  update() {
    const {element_, props, children} = this;

    if (props) {
      for (const [key, prop] of Object.entries(props)) {
        updateProp(element_, key, prop);
      }
    }

    if (children) {
      for (const child of children) {
        if (child instanceof Component) child.update();
        else updateChild(element_, child);
      }
    }

    return this;
  }
}

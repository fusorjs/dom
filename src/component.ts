import {DynamicChild, DynamicProps} from './types';
import {updateProp} from './prop/update';
import {updateChild} from './child/updateChild';

export class Component<E extends Element> {
  constructor(
    readonly element: E,
    private props?: DynamicProps,
    private children?: readonly DynamicChild<E>[],
  ) {}

  update() {
    const {element, props, children} = this;

    if (props) {
      for (const [key, prop] of Object.entries(props)) {
        updateProp(element, key, prop);
      }
    }

    if (children) {
      const {length} = children;

      for (let i = 0; i < length; i++) {
        const child = children[i];

        if (child instanceof Component) child.update();
        else updateChild(element, child);
      }
    }

    return this;
  }
}

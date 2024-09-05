import {DynamicChild, DynamicProps} from './types';
import {updateProp} from './prop/updateProp';
import {updateChild} from './child/updateChild';

export const updateParameters = (element: Element, params: DynamicProps) => {
  for (const [key, prop] of Object.entries(params)) {
    updateProp(element, key, prop);
  }
};

export const updateChildren = (
  element: Element,
  children: readonly DynamicChild<any>[],
) => {
  const {length} = children;

  for (let i = 0; i < length; i++) {
    const child = children[i];

    if (child instanceof Component) {
      child.update();
    } else {
      updateChild(element, child);
    }
  }
};

/**
 * @deprecated
 * @internal library use only
 */
export class Component<E extends Element> {
  constructor(
    /** @deprecated use public API method `getElement(component)` instead */
    readonly element: E,
    private props?: DynamicProps,
    private children?: readonly DynamicChild<E>[],
  ) {}

  /** @deprecated use public API method `update(component)` instead */
  update() {
    const {element, props, children} = this;

    if (props) updateParameters(element, props);

    if (children) updateChildren(element, children);

    return this;
  }
}

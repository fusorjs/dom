import {elementComponent} from './element-component';
import {Distinct, LifeMount, LifeUnmount, TagName} from './types';

type LifeElementName = string & Distinct<'MountName'>;

const allDefinedTags: Record<TagName, LifeElementName> = {};

export const getLifeElementName = (tag: TagName) => {
  {
    const name = allDefinedTags[tag];

    if (name) return name;
  }

  const name = ('fusorjs-life-' + tag) as LifeElementName;

  allDefinedTags[tag] = name;

  const Constructor = document.createElement(tag).constructor as {
    prototype: HTMLElement;
    new (): HTMLElement;
  };

  customElements.define(
    name,
    class extends Constructor {
      constructor() {
        super();
      }
      mount?: LifeMount = undefined;
      unmount?: LifeUnmount = undefined;
      connectedCallback() {
        const {mount} = this;

        if (!mount) return;

        this.unmount = mount(elementComponent.get(this));
      }
      disconnectedCallback() {
        this.unmount?.();
      }
    },
    {
      extends: tag,
    },
  );

  return name;
};

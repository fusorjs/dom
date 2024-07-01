import {elementExtrasName, globalName} from './share';
import {Distinct, ElementExtras, TagName} from './types';

type LifeElementName = string & Distinct<'MountName'>;

const allDefinedTags: Record<TagName, LifeElementName> = {};
const customPrefix = globalName + '-life-';

export const getLifeElementName = (tag: TagName) => {
  {
    const name = allDefinedTags[tag];

    if (name) return name;
  }

  const name = (customPrefix + tag) as LifeElementName;

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
      [elementExtrasName]?: ElementExtras;
      connectedCallback() {
        const extras = this[elementExtrasName];

        if (!extras) return;

        const {mount} = extras;

        if (!mount) return;

        extras.unmount = mount(extras.component ?? this);
      }
      disconnectedCallback() {
        this[elementExtrasName]?.unmount?.();
      }
    },
    {
      extends: tag,
    },
  );

  return name;
};

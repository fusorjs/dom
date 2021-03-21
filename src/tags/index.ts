
interface Tag {
  (...args: ComponentCreatorOptArgs): ReturnType<ComponentCreator>;
}

interface TagCreator {
  (tagName: string, createComponent: ComponentCreator): Tag;
}

export const createTag: TagCreator = (tagName, createComponent) => (
  (...args) => createComponent(tagName, ...args)
);

interface TagMap {
  [key: string]: Tag;
}

interface TagsCreator {
  (tagNames: string[], createComponent: ComponentCreator): TagMap;
}

export const createTags: TagsCreator = (tagNames, createComponent) => {
  const componentCreators: TagMap = {};

  for (const tagName of tagNames) {
    componentCreators[tagName] = createTag(tagName, createComponent);
  }

  return componentCreators;
};

export * from './HTML_TAG_NAMES';
export * from './SVG_TAG_NAMES';

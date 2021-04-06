
interface Tag <Result> {
  (...args: ComponentArgs): ReturnType<Component<Result>>;
}

export const createTag = <Result> (tagName: string, createComponent: Component<Result>): Tag<Result> => (
  (...args) => createComponent(tagName, ...args)
);

export const createTags = <Result> (tagNames: string[], createComponent: Component<Result>) => {
  const componentCreators: {[key: string]: Tag<Result>} = {};

  for (const tagName of tagNames) {
    componentCreators[tagName] = createTag(tagName, createComponent);
  }

  return componentCreators;
};

export * from './HTML_TAG_NAMES';
export * from './SVG_TAG_NAMES';

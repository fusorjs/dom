export const createTaggedMap = <M, K extends keyof M>(
  tagNames: readonly K[],
  tagComponent: (tagName: K) => M[K],
) => {
  const tags: M = {} as M;

  for (const name of tagNames) {
    tags[name] = tagComponent(name);
  }

  return tags;
};

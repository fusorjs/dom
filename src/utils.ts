import {Creator} from './element';

export const tagComponents = <Key extends string, E extends Element>(
  tagNames: readonly Key[],
  tagComponent: (tagName: string) => Creator<E>,
) => {
  type Tags = Record<Key, Creator<E>>;

  const tags: Tags = {} as Tags;

  for (const name of tagNames) {
    tags[name] = tagComponent(name);
  }

  return tags;
};

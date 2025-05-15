/** this conditions will be removed in the production build */
export const DEVELOPMENT = true; // TODO

export const globalName = 'fusorjs';
export const elementExtrasName = ('_' + globalName) as '_fusorjs';

// ? do we need it if we compare strings ?
export const ObjectIs = Object.is;

export const getPropertyDescriptor = (
  value: any,
  property: string,
): PropertyDescriptor | undefined => {
  let result;

  do result = Object.getOwnPropertyDescriptor(value, property);
  while (!result && (value = Object.getPrototypeOf(value)));

  return result;
};

// todo Object, Set, array of pairs
// export const KEYED_CHILDREN = Symbol('KEYED_CHILDREN');


export const isVoid = (v: unknown) => v === null || v === undefined;
export const isEmpty = (v: unknown) => v === false || v === null || v === undefined;
export const isArray = (v: object) => v.constructor === Array;
export const isObject = (v: object) => v.constructor === Object;
export const isFunction = (v: object) => v.constructor === Function;

export const isLiteral = (v: any) => {
  const t = typeof v;
  return t === 'string' || t === 'number';
};

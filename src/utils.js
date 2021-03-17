
export const isVoid = v => v === null || v === undefined;
export const isEmpty = v => v === false || v === null || v === undefined;
export const isArray = v => v.constructor === Array;
export const isObject = v => v.constructor === Object;
export const isFunction = v => v.constructor === Function;

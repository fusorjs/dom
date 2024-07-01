import {stringify} from './stringify';

export type ProxyLog = string[] & {
  disabled?: boolean;
};

const LOGGER_TARGET = '_t';
export const LOGGER_NAME = Symbol('LOGGER_NAME');
export type ProxyTarget<T> = T & {
  [LOGGER_TARGET]: T;
};

const JEST_IMPL = 'impl';
const JEST_SAMEOBJECT_CACHES = 'SameObject caches';

const toString = (value: any) => {
  if (value?.[LOGGER_NAME]) return value[LOGGER_NAME];
  if (typeof value === 'function') return '#function';

  return stringify(value);
};

export const getProxyLogger: (
  log: ProxyLog,
  name: string,
) => Required<ProxyHandler<never>> = (log, name) => ({
  apply(target, thisArg, args) {
    const {length} = log;
    let res = Reflect.apply(target, thisArg, args) as any;

    if (log.disabled) return res;

    let resName = '';

    if (res?.[LOGGER_NAME]) {
      resName = res[LOGGER_NAME];
    } else if (
      typeof res === 'function' ||
      (typeof res === 'object' && res !== null)
    ) {
      resName = `#${length}`;
      res = logger(res, log, resName);
    } else {
      resName = toString(res);
    }

    log.splice(
      length,
      0,
      `${name} apply ${args.map(toString).join(' ')}${
        args.length ? ' ' : ''
      }>> ${resName}`,
    );

    return res;
  },
  construct(target, args, newTarget) {
    log.disabled ||
      log.push(`${name} construct ${args.map(toString).join(' ')}`);
    return Reflect.construct(target, args, newTarget);
  },
  defineProperty(target, key, attributes) {
    log.disabled ||
      log.push(`${name} defineProperty ${String(key)} ${toString(attributes)}`);
    return Reflect.defineProperty(target, key, attributes);
  },
  deleteProperty(target, key) {
    log.disabled || log.push(`${name} deleteProperty ${String(key)}`);
    return Reflect.deleteProperty(target, key);
  },
  get(target, key, receiver) {
    if (key === LOGGER_NAME) return name;

    if (key === LOGGER_TARGET) return target;

    // if (typeof key === 'symbol' && key.description === JEST_SAMEOBJECT_CACHES)
    //   return (receiver as any)[key];

    const {length} = log;
    let res = Reflect.get(target, key, receiver) as any;

    if (log.disabled) return res;
    if (typeof key === 'symbol' && key.description === JEST_IMPL) return res;

    let resName = '';

    if (res?.[LOGGER_NAME]) {
      resName = res[LOGGER_NAME];
    } else if (
      typeof res === 'function' ||
      (typeof res === 'object' && res !== null)
    ) {
      res = logger(
        typeof res === 'function'
          ? (...args: any) => (target[key] as Function)(...args)
          : res,
        log,
        `${name}.${String(key)}`,
      );
    } else {
      resName = toString(res);
    }

    log.splice(
      length,
      0,
      `${name}.${String(key)}${resName ? ' >> ' + resName : ''}`,
    );

    return res;
  },
  getOwnPropertyDescriptor(target, key) {
    // if (typeof key === 'symbol' && key.description === JEST_IMPL)
    //   return (this as any)[key];

    if (!(typeof key === 'symbol' && key.description === JEST_IMPL))
      log.disabled ||
        log.push(`${name} getOwnPropertyDescriptor ${String(key)}`);

    return Reflect.getOwnPropertyDescriptor(target, key);
  },
  getPrototypeOf(target) {
    log.disabled || log.push(`${name} getPrototypeOf`);
    return Reflect.getPrototypeOf(target);
  },
  has(target, key) {
    log.disabled || log.push(`${name} has ${String(key)}`);
    return Reflect.has(target, key);
  },
  isExtensible(target) {
    log.disabled || log.push(`${name} isExtensible`);
    return Reflect.isExtensible(target);
  },
  ownKeys(target) {
    log.disabled || log.push(`${name} ownKeys`);
    return Reflect.ownKeys(target);
  },
  preventExtensions(target) {
    log.disabled || log.push(`${name} preventExtensions`);
    return Reflect.preventExtensions(target);
  },
  set(target, key, value, receiver) {
    log.disabled || log.push(`${name} set ${String(key)} ${toString(value)}`);
    return Reflect.set(target, key, value, receiver);
  },
  setPrototypeOf(target, prototype) {
    log.disabled || log.push(`${name} setPrototypeOf ${toString(prototype)}`);
    return Reflect.setPrototypeOf(target, prototype);
  },
});

export const logger = <T extends object>(value: T, log: any[], name: string) =>
  new Proxy(value, getProxyLogger(log, name)) as ProxyTarget<T>;

export const elm = (tagName: string) => document.createElement(tagName);

// ! Do not remove `spec` from file name
// ! Otherwise jest will pollute data on `coverage`

import {emptyChild} from './child/share';
import {Component} from './component';
import {p} from './help/html';
import {emptyAttr} from './prop/share';

export type ProxyLog = string[] & {
  disabled?: boolean;
};

export type ProxyTarget<T> = T & {
  [GET_LOGGER_TARGET]: T;
};

const GET_LOGGER_TARGET = '_t';
const GET_LOGGER_NAME = Symbol('GET_LOGGER_NAME');

const JEST_IMPL = 'impl';
const JEST_SAMEOBJECT_CACHES = 'SameObject caches';

const stringify = (value: any) => {
  if (value != null && value[GET_LOGGER_NAME]) return value[GET_LOGGER_NAME];

  if (value instanceof Text) return `Text(${value.nodeValue})`;
  if (value instanceof Element) return value.outerHTML;
  if (value instanceof Component)
    return `Component(${value.element.outerHTML})`;

  return String(value);
};

export const getProxyLogger: (
  log: ProxyLog,
  name: string,
) => Required<ProxyHandler<never>> = (log, name) => ({
  apply(target, thisArg, args) {
    log.disabled || log.push(`${name} apply ${args.map(stringify)}`);
    return Reflect.apply(target, thisArg, args);
  },
  construct(target, args, newTarget) {
    log.disabled ||
      log.push(`${name} construct ${args.map(stringify).join(' ')}`);
    return Reflect.construct(target, args, newTarget);
  },
  defineProperty(target, key, attributes) {
    log.disabled ||
      log.push(
        `${name} defineProperty ${String(key)} ${stringify(attributes)}`,
      );
    return Reflect.defineProperty(target, key, attributes);
  },
  deleteProperty(target, key) {
    log.disabled || log.push(`${name} deleteProperty ${String(key)}`);
    return Reflect.deleteProperty(target, key);
  },
  get(target, key, receiver) {
    if (key === GET_LOGGER_NAME) return name;

    if (key === GET_LOGGER_TARGET) return target;

    // if (typeof key === 'symbol' && key.description === JEST_SAMEOBJECT_CACHES)
    //   return (receiver as any)[key];

    // if (typeof key === 'symbol' && key.description === JEST_IMPL)
    //   return (receiver as any)[key];

    const prop = Reflect.get(target, key, receiver);

    if (log.disabled) return prop;

    if (!(typeof key === 'symbol' && key.description === JEST_IMPL))
      log.push(`${name} get ${String(key)}`);

    // const prop = Reflect.get(target, key, target);
    // const prop = target[key];
    // return prop;

    if (typeof prop === 'function') {
      return (...args: any) => {
        log.push(`${name} run ${String(key)} ${args.map(stringify).join(' ')}`);
        return (target[key] as Function)(...args);
        // return (prop as Function).apply(target, args);
      };
    }

    return prop;
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
    log.disabled || log.push(`${name} set ${String(key)} ${stringify(value)}`);
    return Reflect.set(target, key, value, receiver);
  },
  setPrototypeOf(target, prototype) {
    log.disabled || log.push(`${name} setPrototypeOf ${stringify(prototype)}`);
    return Reflect.setPrototypeOf(target, prototype);
  },
});

export const logger = <T extends object>(value: T, log: any[], name: string) =>
  new Proxy(value, getProxyLogger(log, name)) as ProxyTarget<T>;

export const elm = (tagName: string) => document.createElement(tagName);

/** @deprecated test data */

type TestItem = [any, string, string?];

export const getStringTestData = ((all) => {
  return [
    // repeat all items
    ...all,
    ...all,
    ...[...all].reverse(),
    ...all,
    ...all,
  ] as const;
})([
  // numbers
  [0, '0'],
  [-0, '0'],
  [-42, '-42'],
  [123, '123'],
  [NaN, 'NaN'],

  // strings
  ['', ''],
  ['0', '0'],
  ['-0', '-0'],
  ['-42', '-42'],
  ['123', '123'],
  ['abc', 'abc'],

  // booleans
  [true, 'true'],
  [false, 'false'],

  // nulls
  [null, 'null'],
  [undefined, 'undefined'],

  // symbols
  [Symbol(), 'Symbol()'],
  [Symbol('sym'), 'Symbol(sym)'],

  // arrays
  [[], '[]'],
  [[1, 2, 3], '[1,2,3]'],
  [[1, 2, 4], '[1,2,4]'],
  [['a', 'b'], '["a","b"]'],
  [['a', emptyChild, 'b'], '["a","","b"]'],
  [[8, () => 'f', p(() => 3)], `[8,() => 'f',<p>3</p>]`],

  // objects
  [{}, '{}'],
  [{a: 1}, '{"a":1}'],
  [{a: 1, b: 2}, '{"a":1,"b":2}'],
  [{a: 1, b: 3}, '{"a":1,"b":3}'],
  [{a: 1, b: 3, c: emptyAttr}, '{"a":1,"b":3,"c":undefined}'],
  [{a: 1, b: () => 's', c: p(() => 5)}, `{"a":1,"b":() => 's',"c":<p>5</p>}`],

  // functions
  // [() => {}, '() => { }'],
  // [() => 123, '() => 123'],
  // [() => () => 'abc', "() => () => 'abc'"],
  // [(x: any) => x + x, '(x) => x + x'],

  // elements
  [document.createElement('span'), '<span></span>'],
  [
    (() => {
      const e = document.createElement('div');
      e.append('monna');
      return e;
    })(),
    '<div>monna</div>',
  ],
  [
    (() => {
      const e = document.createElement('article');
      e.setAttribute('id', 'abba');
      e.append('contra');
      return e;
    })(),
    '<article id="abba">contra</article>',
  ],
  [
    document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    '<svg></svg>',
  ],

  // components
  [new Component(document.createElement('section')), '<section></section>'],
  [
    new Component(
      (() => {
        const e = document.createElement('p');
        e.append('zabba');
        return e;
      })(),
    ),
    '<p>zabba</p>',
  ],
] as TestItem[]).reduce((acc, one) => {
  const [p, e] = one;

  acc.push(
    // repeat one item
    one,
    one,
    // [() => p, '() => p', e],
    // [() => () => p, '() => () => p'],
    // one,
    one,
  );

  return acc;
}, [] as TestItem[]);

test('test data', () => {}); // must be at least one test in spec file

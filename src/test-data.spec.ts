// ! Do not remove `spec` from file name
// ! Otherwise jest will pollute data on `coverage`

import {emptyChild} from './child';
import {Component} from './component';
import {p} from './html';
import {emptyAttr} from './prop/share';

type TestItem = [any, string, string?];

export const getStringTestData = (all => {
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

test('test data', () => {});

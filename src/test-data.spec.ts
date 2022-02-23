import {Component} from './types';

type TestItem = [any, string];

export const getStringTestData = (a => [...a, ...a] as const)([
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

  // objects
  [{}, '{}'],
  [{a: 1, b: 2}, '{"a":1,"b":2}'],

  // functions
  [() => {}, '() => { }'],
  [() => 123, '() => 123'],
  [() => () => 'abc', "() => () => 'abc'"],
  [(x: any) => x + x, '(x) => x + x'],

  // elements
  [document.createElement('div'), '<div></div>'],
  [
    (() => {
      const e = document.createElement('div');
      e.setAttribute('id', 'abba');
      e.append('contra');
      return e;
    })(),
    '<div id="abba">contra</div>',
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
] as TestItem[]).reduce((acc, i) => {
  const [p] = i;

  acc.push(i, [() => p, '() => p'], [() => () => p, '() => () => p'], i, i);

  return acc;
}, [] as TestItem[]);

test('test data', () => {});

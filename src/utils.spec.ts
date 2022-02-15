import {evaluate, getString, stringify, createTaggedMap} from './utils';

test.each([
  [() => 1, 1],
  [() => () => 2, 2],
  [() => () => () => 3, 3],
  [() => () => () => () => 4, 4],
  [() => () => () => () => () => 5, 5],
])('evaluate %p to be %p', (provided: any, expected) => {
  expect(evaluate(provided)).toBe(expected);
});

test('evaluate throws preventing indefinite callback', () => {
  expect(() => {
    evaluate(() => () => () => () => () => () => 6);
  }).toThrow(new TypeError(`preventing indefinite callback: 6`));
});

test.each([
  [{}, '{}'],
  [{a: 1}, '{"a":1}'],
  [[], '[]'],
  [[1], '[1]'],
  [() => {}, '() => { }'],
  [(x: any) => x + x, '(x) => x + x'],
  [1, '1'],
  ['', ''],
  ['a', 'a'],
  [true, 'true'],
  [Symbol(), 'Symbol()'],
  [Symbol('sss'), 'Symbol(sss)'],
  [NaN, 'NaN'],
  [null, 'null'],
  [undefined, 'undefined'],
])('getString %p to be %p', (provided, expected) => {
  expect(getString(provided)).toBe(expected);
});

test.each([
  [{}, '{}'],
  [{a: 1}, '{"a":1}'],
  [[], '[]'],
  [[1], '[1]'],
  [() => {}, '() => { }'],
  [(x: any) => x + x, '(x) => x + x'],
  [1, '1'],
  ['', '""'],
  ['a', '"a"'],
  [true, 'true'],
  [Symbol(), 'Symbol()'],
  [Symbol('sss'), 'Symbol(sss)'],
  [NaN, 'NaN'],
  [null, 'null'],
  [undefined, 'undefined'],
])('getString %p to be %p', (provided, expected) => {
  expect(stringify(provided)).toBe(expected);
});

test('createTaggedMap to be correct', () => {
  type M = {a: string; b: string};

  expect(createTaggedMap<M, keyof M>(['a', 'b'], v => v + v)).toEqual({
    a: 'aa',
    b: 'bb',
  });
});

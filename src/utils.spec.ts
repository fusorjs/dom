import {getStringTestData} from './test-data.spec';
import {evaluate, getString, stringify, createTaggedMap} from './utils';

test.each([
  [() => 1, 1],
  [() => () => 2, 2],
  [() => () => () => 3, 3],
  [() => () => () => () => 4, 4],
  [() => () => () => () => () => 5, 5],
])('evaluate provided %p expected %p', (provided: any, expected) => {
  expect(evaluate(provided)).toBe(expected);
});

test('evaluate throws preventing indefinite callback', () => {
  expect(() => {
    evaluate(() => () => () => () => () => () => 6);
  }).toThrow(new TypeError(`preventing indefinite callback: 6`));
});

test.each(getStringTestData)(
  'get string provided %p expected %p',
  (provided, expected) => {
    expect(getString(provided)).toBe(expected);
  },
);

test.each(
  getStringTestData.map(
    // add "quotes" around expected strings
    ([p, e]) => [p, typeof p === 'string' ? `"${e}"` : e] as const,
  ),
)('stringify provided %p expected %p', (provided, expected) => {
  expect(stringify(provided)).toBe(expected);
});

test('create tagged map', () => {
  type M = {a: string; b: string};

  expect(createTaggedMap<M, keyof M>(['a', 'b'], v => v + v)).toEqual({
    a: 'aa',
    b: 'bb',
  });
});

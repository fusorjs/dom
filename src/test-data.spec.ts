export const getStringTestData = (d => [
  ...d,
  ...d.map(([p]) => [() => p, '() => p'] as const),
  ...d.map(([p]) => [() => () => p, '() => () => p'] as const),
  ...d,
])([
  // numbers
  [0, '0'],
  [-0, '0'],
  [-1, '-1'],
  [123, '123'],
  [NaN, 'NaN'],

  // strings
  ['', ''],
  ['0', '0'],
  ['abc', 'abc'],
  ['', ''],

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
] as const);

test('test data', () => {});

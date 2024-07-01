import {convertChild, emptyChild} from './convertChild';

test.each([
  [null, emptyChild],
  [true, emptyChild],
  [false, emptyChild],
  [undefined, emptyChild],
  [emptyChild, emptyChild],
  [123, '123'],
  ['str', 'str'],
])('convert child provided %p expected %p', (provided, expected) => {
  expect(convertChild(provided)).toBe(expected);
});

test.each([
  [NaN, TypeError, 'invalid child: NaN'],
  [[], TypeError, 'invalid child: []'],
  [{}, TypeError, 'invalid child: {}'],
])(
  'convert attribute provided %p expected %p',
  (provided, expectedType, expectedMessage) => {
    expect(() => {
      convertChild(provided);
    }).toThrow(expectedType);

    expect(() => {
      convertChild(provided);
    }).toThrow(expectedMessage);
  },
);

import {convertAttribute, emptyAttribute} from './convertAttribute';

test.each([
  ['', emptyAttribute],
  [null, emptyAttribute],
  [false, emptyAttribute],
  [emptyAttribute, emptyAttribute],
  [true, ''],
  [123, '123'],
  ['str', 'str'],
])('convert attribute provided %p expected %p', (provided, expected) => {
  expect(convertAttribute(provided)).toBe(expected);
});

test.each([
  [NaN, TypeError, 'invalid attribute: NaN'],
  [[], TypeError, 'invalid attribute: []'],
  [{}, TypeError, 'invalid attribute: {}'],
])(
  'convert attribute provided %p expected %p',
  (provided, expectedType, expectedMessage) => {
    expect(() => {
      convertAttribute(provided);
    }).toThrow(expectedType);

    expect(() => {
      convertAttribute(provided);
    }).toThrow(expectedMessage);
  },
);

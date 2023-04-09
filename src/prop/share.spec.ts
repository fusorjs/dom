import {convertAttr, emptyAttr} from './share';

test.each([
  ['', emptyAttr],
  [null, emptyAttr],
  [false, emptyAttr],
  [true, ''],
  [emptyAttr, emptyAttr],
  [123, 123],
  ['str', 'str'],
  (e => [e, e])({}),
])('convert attribute provided %p expected %p', (provided, expected) => {
  expect(convertAttr(provided)).toBe(expected);
});

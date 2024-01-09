import {convertChild, emptyChild} from './share';

test.each([
  [null, emptyChild],
  [true, emptyChild],
  [false, emptyChild],
  [undefined, emptyChild],
  [emptyChild, emptyChild],
  [123, 123],
  ['str', 'str'],
  ((e) => [e, e])({}),
])('convert child provided %p expected %p', (provided, expected) => {
  expect(convertChild(provided)).toBe(expected);
});

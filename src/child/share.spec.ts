import {Component} from '../component';
import {getString} from '../share';

import {convertChild, emptyChild, getChildNode} from './share';

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

test.each([
  ((v) => [v, v])(document.createElement('div')),
  ((v) => [v, v.element])(new Component(document.createElement('div'))),
  ((v) => [v, document.createTextNode(getString(v))])('other'),
  ((v) => [v, document.createTextNode(getString(v))])(() => {}),
])('get child node provided %p expected %p', (provided, expected) => {
  if (expected instanceof Text)
    expect(getChildNode(provided)).toEqual(expected);
  else expect(getChildNode(provided)).toBe(expected);
});

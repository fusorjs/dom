import {Component} from './component';
import {elm} from './lib/proxyLogger';
import {stringify} from './lib/stringify';
import {getElement, isUpdatable, update} from './public';
import {div, input} from './help/html';
import {Fusion} from './types';

// getElement

test('getElement propagates element type', () => {
  // The TypeScript compiler will fail if the types are incorrect.
  getElement(input()).value = 'abc';
});

test.each<[string, TypeErrorConstructor, any]>(
  // prettier-ignore
  [
    [ `does not have an element: 123`, TypeError , 123 ],
  ],
)('getElement throws "%p" %p', (expectedMessage, expectedType, provided) => {
  expect(() => {
    getElement(provided);
  }).toThrow(expectedType);

  expect(() => {
    getElement(provided);
  }).toThrow(expectedMessage);
});

test.each<[string, any, any]>(
  // prettier-ignore
  [
    ((v) => [stringify(v), v, v        ])(elm('div')               ),
    ((v) => [stringify(v), v, v.element])(new Component(elm('div'))),
  ],
)('getElement: %p', (description, provided, expected) => {
  expect(getElement(provided)).toBe(expected);
});

// isUpdatable

test.each<[string, any, boolean]>(
  // prettier-ignore
  [
    ((v) => [stringify(v), v, false])(123                      ),
    ((v) => [stringify(v), v, true ])(new Component(elm('div'))),
  ],
)('isUpdatable: %p', (description, provided, expected) => {
  expect(isUpdatable(provided)).toBe(expected);
});

// update

test('update propagates element type', () => {
  // The TypeScript compiler will fail if the types are incorrect.
  getElement(update(input(() => {}))).value = 'str';
});

test.each<[string, TypeErrorConstructor, any]>(
  // prettier-ignore
  [
    [ `not updatable: 123`, TypeError , 123 ],
  ],
)('update throws "%p" %p', (expectedMessage, expectedType, provided) => {
  expect(() => {
    update(provided);
  }).toThrow(expectedType);

  expect(() => {
    update(provided);
  }).toThrow(expectedMessage);
});

test.each<[Fusion, string]>([
  ((x = 0) => [div(() => ++x), '<div>2</div>'])(),
  ((x = 0, y = 0) => [
    div(
      () => ++x,
      div(() => ++y),
    ),
    '<div>2<div>2</div></div>',
  ])(),

  // non recursive update
  ((x = 0, y = 0, comp = div(() => ++y)) => [
    div(
      () => ++x,
      () => comp, // stop update recursion by wrapping component in a function
    ),
    '<div>2<div>1</div></div>',
  ])(),
])('update: %p %p', (provided, expected) => {
  expect(getElement(update(provided)).outerHTML).toBe(expected);
});

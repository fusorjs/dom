import {Component} from './component';
import {elm} from './lib/proxyLogger';
import {stringify} from './lib/stringify';
import {getElement, isUpdatable, update} from './public';

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

test.each<[string, any, boolean]>(
  // prettier-ignore
  [
    ((v) => [stringify(v), v, false])(123                      ),
    ((v) => [stringify(v), v, true ])(new Component(elm('div'))),
  ],
)('isUpdatable: %p', (description, provided, expected) => {
  expect(isUpdatable(provided)).toBe(expected);
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

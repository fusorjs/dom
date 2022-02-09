import {Component} from '.';
import {path, svg} from './svg';

test('empty svg', () => {
  const result = path();

  expect(result).toBeInstanceOf(SVGElement);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(0);
});

test('staic svg', () => {
  const result = path({width: 100}, 'bbb');

  expect(result).toBeInstanceOf(SVGElement);
  expect(result.attributes.length).toBe(0); // todo check why no attrs
  expect(result.childNodes.length).toBe(1);
});

test('dynamic div', () => {
  const result = svg(() => 'bbb');

  expect(result).toBeInstanceOf(Component);

  const element = result.getElement();

  expect(element).toBeInstanceOf(SVGElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
});

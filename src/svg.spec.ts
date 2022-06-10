import {Component} from './element';
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
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
});

test('dynamic div', () => {
  const result = svg(() => 'bbb');

  expect(result).toBeInstanceOf(Component);

  const {element} = result;

  expect(element).toBeInstanceOf(SVGSVGElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
});

// test('correct typescript typings', () => {
//   expect(svg().x).toBe('');
//   expect(path().ariaPlaceholder).toBe('');
//   expect(text().fontSize).toBe('');
// });

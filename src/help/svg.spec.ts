import {getElement, isUpdatable} from '../public';

import {svgTagNames} from './constants';
import * as allTags from './svg';
import {circle, path, svg} from './svg';

test('all svg tags are defined', () => {
  expect(svgTagNames.filter((i) => !(allTags as any)[i])).toEqual(['switch']);
  expect(allTags.sswitch).toBeDefined();
});

test('empty svg', () => {
  const result = path() as SVGElement;

  expect(result).toBeInstanceOf(SVGElement);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(0);
});

test('staic svg', () => {
  const result = path({width: 100}, 'bbb') as SVGElement;

  expect(result).toBeInstanceOf(SVGElement);
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
});

test('dynamic div', () => {
  const result = svg(() => 'bbb');

  expect(isUpdatable(result)).toBe(true);

  const element = getElement(result);

  expect(element).toBeInstanceOf(SVGSVGElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
});

test('correct typescript typings', () => {
  expect(getElement(svg({x_p: 123})).x).toBe(123);
  expect(getElement(circle({r_p: 321})).r).toBe(321);
});

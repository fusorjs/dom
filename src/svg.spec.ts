import {path} from './svg';

test('empty svg', () => {
  const result = path() as SVGElement;
  expect(result).toBeInstanceOf(SVGElement);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(0);
});

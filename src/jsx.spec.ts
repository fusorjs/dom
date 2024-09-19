import {htmlTagNames} from './help/constants';
import {mathMlTagNamesSet, svgTagNamesSet} from './jsx';

test.each<[description: string, one: readonly any[], two: readonly any[]]>([
  ['svg and html tags', [...svgTagNamesSet], htmlTagNames],
  ['mathml and html tags', [...mathMlTagNamesSet], htmlTagNames],
  ['svg and mathml tags', [...svgTagNamesSet], [...mathMlTagNamesSet]],
])('no intersection between %p', (description, one, two) => {
  expect(one.filter((i) => two.includes(i))).toEqual([]);
});

import {mathMlTagNames} from './constants';
import * as allTags from './mathml';

test('all MathML tags are defined', () => {
  expect(mathMlTagNames.filter((i) => !(allTags as any)[i])).toEqual([
    'annotation-xml',
  ]);
  expect(allTags.annotationXml).toBeDefined();
});

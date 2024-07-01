import {svgNamespace} from './constants';
import {getTaggedInitMapHelper, h, s} from './initHelper';

test('h', () => {
  expect(h('a')).toStrictEqual(document.createElement('a'));
});

test('s', () => {
  expect(s('a')).toStrictEqual(document.createElementNS(svgNamespace, 'a'));
});

test('create tagged map', () => {
  type M = {a: string; b: string};

  expect(getTaggedInitMapHelper<M, keyof M>((v) => v + v, ['a', 'b'])).toEqual({
    a: 'aa',
    b: 'bb',
  });
});

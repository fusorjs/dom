import {getTaggedCreatorMap} from './create';

test('create tagged map', () => {
  type M = {a: string; b: string};

  expect(getTaggedCreatorMap<M, keyof M>((v) => v + v, ['a', 'b'])).toEqual({
    a: 'aa',
    b: 'bb',
  });
});

import {getTaggedInitMapHelper} from './share';

test('create tagged map', () => {
  type M = {a: string; b: string};

  expect(getTaggedInitMapHelper<M, keyof M>((v) => v + v, ['a', 'b'])).toEqual({
    a: 'aa',
    b: 'bb',
  });
});

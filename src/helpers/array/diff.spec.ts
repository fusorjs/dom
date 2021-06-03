
import {diff, PrevMap} from './diff';

describe('createDiff', () => {

  // Algorithm:
  // 1) update next
  // 2) replace/remove/pop previous in reverse
  // 3) insert/push next
  // 4) swap previous recursive
  // todo turn on/off algorithm check to validate new strategies

  const genericDiff = <T> (
    stringifyArray: (a: T[]) => string, stringifyValue: (v: T) => string,
    prevArray: T[], nextArray: T[], key?: string, prevMap?: PrevMap<T>
  ) => {
    let result: string[] = [];
    let ctrlArray: T[] = [...prevArray];

    const format = (...args: (string|number)[]) => stringifyArray(ctrlArray) + args.join(' ');

    diff({
      prevArray,
      nextArray,
      push: (value) => {
        ctrlArray.push(value);
        result.push(format('push', stringifyValue(value)));
      },
      insert: (index, value) => {
        ctrlArray.splice(index, 0, value);
        result.push(format('insert', index, stringifyValue(value)));
      },
      replace: (index, value) => {
        ctrlArray[index] = value;
        result.push(format('replace', index, stringifyValue(value)));
      },
      swap: (prevIndex, nextIndex) => {
        const prev = ctrlArray[prevIndex];
        ctrlArray[prevIndex] = ctrlArray[nextIndex];
        ctrlArray[nextIndex] = prev;
        result.push(format('swap', prevIndex, nextIndex));
      },
      pop: () => {
        ctrlArray.pop();
        result.push(format('pop'));
      },
      remove: (index) => {
        ctrlArray.splice(index, 1);
        result.push(format('remove', index));
      },
      key,
      update: (index, value) => {
        ctrlArray[index] = value;
        result.push(format('update', index, stringifyValue(value)));
      },
      prevMap,
    });

    return result;
  };

  describe('identity by value', () => {

    const toArray = (s: string) => {
      s = s.trim();
      return s ? s.split('  ') : [];
    };
    const stringifyArray = (a: string[]) => `  ${a.join('  ').padEnd(28, ' ')}  |  `;
    const stringifyValue = (v: string) => v;
    const stringDiff = (prev: string, next: string) => genericDiff(
      stringifyArray, stringifyValue, toArray(prev), toArray(next)
    );

    describe('feature', () => {

      describe('remove', () => {
        test('1', () => expect(stringDiff(
          '  a  b  c                       '
        ,
          '  b  c                          '
        )).toStrictEqual([
          '  b  c                          |  remove 0',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(stringDiff(
          '  a  b  c  d  e  f  g  h  i  j  '
        ,
          '  a  e  f  g  h  i  j           '
        )).toStrictEqual([
          '  a  b  c  e  f  g  h  i  j     |  remove 3',
          '  a  b  e  f  g  h  i  j        |  remove 2',
          '  a  e  f  g  h  i  j           |  remove 1',
        ]));
      });

      describe('insert', () => {
        test('1', () => expect(stringDiff(
          '  b  c                          '
        ,
          '  a  b  c                       '
        )).toStrictEqual([
          '  a  b  c                       |  insert 0 a',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(stringDiff(
          '  a  b  c  d  e  f  g           '
        ,
          '  a  b  x  y  z  c  d  e  f  g  '
        )).toStrictEqual([
          '  a  b  x  c  d  e  f  g        |  insert 2 x',
          '  a  b  x  y  c  d  e  f  g     |  insert 3 y',
          '  a  b  x  y  z  c  d  e  f  g  |  insert 4 z',
        ]));
      });

      describe('pop', () => {
        test('1', () => expect(stringDiff(
          '  a  b  c                       '
        ,
          '  a  b                          '
        )).toStrictEqual([
          '  a  b                          |  pop',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(stringDiff(
          '  a  b  c  d  e  f  g           '
        ,
          '  a  b  c  d                    '
        )).toStrictEqual([
          '  a  b  c  d  e  f              |  pop',
          '  a  b  c  d  e                 |  pop',
          '  a  b  c  d                    |  pop',
        ]));
      });

      describe('push', () => {
        test('1', () => expect(stringDiff(
          '  a  b                          '
        ,
          '  a  b  c                       '
        )).toStrictEqual([
          '  a  b  c                       |  push c',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(stringDiff(
          '                                '
        ,
          '  a  b  c                       '
        )).toStrictEqual([
          '  a                             |  push a',
          '  a  b                          |  push b',
          '  a  b  c                       |  push c',
        ]));
      });

      describe('replace', () => {
        test('1', () => expect(stringDiff(
          '  a  b  c                       '
        ,
          '  z  b  c                       '
        )).toStrictEqual([
          '  z  b  c                       |  replace 0 z',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(stringDiff(
          '  a  b  c  d  e  f  g           '
        ,
          '  a  x  c  y  e  z  g           '
        )).toStrictEqual([
          '  a  b  c  d  e  z  g           |  replace 5 z',
          '  a  b  c  y  e  z  g           |  replace 3 y',
          '  a  x  c  y  e  z  g           |  replace 1 x',
        ]));
      });

      describe('swap', () => {
        test('1', () => expect(stringDiff(
          '  a  b  c                       '
        ,
          '  c  b  a                       '
        )).toStrictEqual([
          '  c  b  a                       |  swap 0 2',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('2 recursive', () => expect(stringDiff(
          '  a  b  c                       '
        ,
          '  c  a  b                       '
        )).toStrictEqual([
          '  b  a  c                       |  swap 0 1',
          '  c  a  b                       |  swap 0 2',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3 recursive', () => expect(stringDiff(
          '  a  b  c  d                    '
        ,
          '  d  a  b  c                    '
        )).toStrictEqual([
          '  b  a  c  d                    |  swap 0 1',
          '  c  a  b  d                    |  swap 0 2',
          '  d  a  b  c                    |  swap 0 3',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('2 recursive and 1', () => expect(stringDiff(
          '  a  b  c  d  e  f  g           '
        ,
          '  c  g  e  d  a  f  b           '
        )).toStrictEqual([
          '  e  b  c  d  a  f  g           |  swap 0 4',
          '  c  b  e  d  a  f  g           |  swap 0 2',
          '  c  g  e  d  a  f  b           |  swap 1 6',
        ]));
      });

    });

    describe('random', () => {
      test('1', () => expect(stringDiff(
        '  a  b  c  d  e  f              '
      ,
        '  k  l  f  d  c  p  a  h  i  j  '
      )).toStrictEqual([
        '  a  b  c  d  f                 |  remove 4',
        '  a  l  c  d  f                 |  replace 1 l',
        '  k  a  l  c  d  f              |  insert 0 k',
        '  k  a  l  c  d  p  f           |  insert 5 p',
        '  k  a  l  c  d  p  f  h        |  push h',
        '  k  a  l  c  d  p  f  h  i     |  push i',
        '  k  a  l  c  d  p  f  h  i  j  |  push j',
        '  k  f  l  c  d  p  a  h  i  j  |  swap 1 6',
        '  k  l  f  c  d  p  a  h  i  j  |  swap 1 2',
        '  k  l  f  d  c  p  a  h  i  j  |  swap 3 4',
      ]));
      //   0  1  2  3  4  5  6  7  8  9  '
      test('2', () => expect(stringDiff(
        '  a  b  c  d  e  f  g  h  i  j  '
      ,
        '  a  x  e  y  z  h  w  g  i     '
      )).toStrictEqual([
        '  a  b  c  d  e  f  g  h  i     |  pop',
        '  a  b  c  d  e  g  h  i        |  remove 5',
        '  a  b  c  y  e  g  h  i        |  replace 3 y',
        '  a  b  y  e  g  h  i           |  remove 2',
        '  a  x  y  e  g  h  i           |  replace 1 x',
        '  a  x  y  e  z  g  h  i        |  insert 4 z',
        '  a  x  y  e  z  g  w  h  i     |  insert 6 w',
        '  a  x  e  y  z  g  w  h  i     |  swap 2 3',
        '  a  x  e  y  z  h  w  g  i     |  swap 5 7',
      ]));
      //   0  1  2  3  4  5  6  7  8  9  '
      test('3', () => expect(stringDiff(
        '  d  r  y  s  f  w  h  t        '
      ,
        '  f  r  y  a  j  w  k  m  q  x  '
      )).toStrictEqual([
        '  d  r  y  s  f  w  h  m        |  replace 7 m',
        '  d  r  y  s  f  w  k  m        |  replace 6 k',
        '  d  r  y  a  f  w  k  m        |  replace 3 a',
        '  r  y  a  f  w  k  m           |  remove 0',
        '  r  y  a  f  j  w  k  m        |  insert 4 j',
        '  r  y  a  f  j  w  k  m  q     |  push q',
        '  r  y  a  f  j  w  k  m  q  x  |  push x',
        '  y  r  a  f  j  w  k  m  q  x  |  swap 0 1',
        '  a  r  y  f  j  w  k  m  q  x  |  swap 0 2',
        '  f  r  y  a  j  w  k  m  q  x  |  swap 0 3',
      ]));
      //   0  1  2  3  4  5  6  7  8  9  '
      test('4', () => expect(stringDiff(
        '  f  m  r  u  q  c  v  p  a  y  '
      ,
        '  d  f  v  j  s  c  a           '
      )).toStrictEqual([
        '  f  m  r  u  q  c  v  p  a     |  pop',
        '  f  m  r  u  q  c  v  a        |  remove 7',
        '  f  m  r  u  s  c  v  a        |  replace 4 s',
        '  f  m  r  j  s  c  v  a        |  replace 3 j',
        '  f  m  j  s  c  v  a           |  remove 2',
        '  f  j  s  c  v  a              |  remove 1',
        '  d  f  j  s  c  v  a           |  insert 0 d',
        '  d  f  s  j  c  v  a           |  swap 2 3',
        '  d  f  c  j  s  v  a           |  swap 2 4',
        '  d  f  v  j  s  c  a           |  swap 2 5',
      ]));
    });

    test('sequence', () => {
      const prevArray: string[] = [];
      const prevMap: PrevMap<string> = new Map();
      const seqStringDiff = (nextArray: string[]) => genericDiff(
        stringifyArray, stringifyValue, prevArray, nextArray, undefined, prevMap
      );
      const check = (hasPrevMap: boolean, next: string, ...steps: string[]) => {
        const nextArray = toArray(next);
        expect(seqStringDiff(nextArray)).toStrictEqual(steps);
        expect(prevArray).toStrictEqual(nextArray);
        expect(prevMap).toStrictEqual(new Map(hasPrevMap ? nextArray.map((v, i) => [v, i]) : []));
      };

      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        true,
        '  a  b  c                       ',
        '  a                             |  push a',
        '  a  b                          |  push b',
        '  a  b  c                       |  push c',
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        true,
        '  a  b  c  d  e                 ',
        '  a  b  c  d                    |  push d',
        '  a  b  c  d  e                 |  push e',
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        false, // has remove/insert
        '  a  x  d  e  f  g              ',
        '  a  b  d  e                    |  remove 2',
        '  a  x  d  e                    |  replace 1 x',
        '  a  x  d  e  f                 |  push f',
        '  a  x  d  e  f  g              |  push g',
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        false, // has remove/insert
        '  g  x  y  z  e  d  l  f  t  p  ',
        '  x  d  e  f  g                 |  remove 0',
        '  x  d  y  e  f  g              |  insert 2 y',
        '  x  d  y  z  e  f  g           |  insert 3 z',
        '  x  d  y  z  e  f  l  g        |  insert 6 l',
        '  x  d  y  z  e  f  l  g  t     |  push t',
        '  x  d  y  z  e  f  l  g  t  p  |  push p',
        '  d  x  y  z  e  f  l  g  t  p  |  swap 0 1',
        '  f  x  y  z  e  d  l  g  t  p  |  swap 0 5',
        '  g  x  y  z  e  d  l  f  t  p  |  swap 0 7',
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        false, // has remove/insert
        '  f  s  l  z  y  t  b  e        ',
        '  g  x  y  z  e  d  l  f  t     |  pop',
        '  g  x  y  z  e  l  f  t        |  remove 5',
        '  g  s  y  z  e  l  f  t        |  replace 1 s',
        '  s  y  z  e  l  f  t           |  remove 0',
        '  s  y  z  e  l  f  b  t        |  insert 6 b',
        '  y  s  z  e  l  f  b  t        |  swap 0 1',
        '  l  s  z  e  y  f  b  t        |  swap 0 4',
        '  z  s  l  e  y  f  b  t        |  swap 0 2',
        '  e  s  l  z  y  f  b  t        |  swap 0 3',
        '  t  s  l  z  y  f  b  e        |  swap 0 7',
        '  f  s  l  z  y  t  b  e        |  swap 0 5',
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        true,
        '  f  s  l  z  y  t  b  e        ',
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        true,
        '  m  y  s  t  z  l              ',
        '  f  s  l  z  y  t  b           |  pop',
        '  f  s  l  z  y  t              |  pop',
        '  m  s  l  z  y  t              |  replace 0 m',
        '  m  l  s  z  y  t              |  swap 1 2',
        '  m  t  s  z  y  l              |  swap 1 5',
        '  m  z  s  t  y  l              |  swap 1 3',
        '  m  y  s  t  z  l              |  swap 1 4',
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      check(
        true,
        '  z  w  l  g  m  s  a  b        ',
        '  m  y  s  g  z  l              |  replace 3 g',
        '  m  w  s  g  z  l              |  replace 1 w',
        '  m  w  s  g  z  l  a           |  push a',
        '  m  w  s  g  z  l  a  b        |  push b',
        '  z  w  s  g  m  l  a  b        |  swap 0 4',
        '  z  w  l  g  m  s  a  b        |  swap 2 5',
      );
    });

  });

  describe('identity by key with update', () => {

    interface MapObject {
      [k: string]: any;
    }

    const {stringify} = JSON;
    const stringifyArray = (a: MapObject[]) => `${stringify(a)}  |  `;
    const stringifyValue = (v: MapObject) => stringify(v);
    const objectDiff = (prevArray: MapObject[], nextArray: MapObject[], key = 'id') => genericDiff(
      stringifyArray, stringifyValue, prevArray, nextArray, key
    );

    test('no changes', () => {
      const same = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}];
      expect(objectDiff(same, same)).toStrictEqual([]);
    });

    test('no update without the key', () => {
      const prev = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}];
      const next = [...prev]; next[1] = {"id":"b","val":"BBB"};
      expect(objectDiff(prev, next, '')).toStrictEqual([
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"c","val":"ccc"}]  |  replace 1 {"id":"b","val":"BBB"}',
      ]);
    });

    test('update', () => {
      const prev = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}];
      const next = [...prev]; next[1] = {"id":"b","val":"BBB"};
      expect(objectDiff(prev, next)).toStrictEqual([
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"c","val":"ccc"}]  |  update 1 {"id":"b","val":"BBB"}',
      ]);
    });

    test('random increase', () => {
      const prev = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"},{"id":"d","val":"ddd"}];
      const next = [...prev];
      next[1] = {"id":"c","val":"CCC"};
      next[2] = prev[0];
      next[0] = {"id":"x","val":"xxx"};
      next.push({"id":"e","val":"eee"});
      // [{"id":"x","val":"xxx"},{"id":"c","val":"CCC"},{"id":"a","val":"aaa"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]
      expect(objectDiff(prev, next)).toStrictEqual([
        '[{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"}]  |  update 2 {"id":"c","val":"CCC"}',
        '[{"id":"a","val":"aaa"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"}]  |  remove 1',
        '[{"id":"x","val":"xxx"},{"id":"a","val":"aaa"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"}]  |  insert 0 {"id":"x","val":"xxx"}',
        '[{"id":"x","val":"xxx"},{"id":"a","val":"aaa"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  push {"id":"e","val":"eee"}',
        '[{"id":"x","val":"xxx"},{"id":"c","val":"CCC"},{"id":"a","val":"aaa"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  swap 1 2',
      ]);
    });

    test('random decrease', () => {
      const prev = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}];
      const next = [...prev];
      next[1] = {"id":"d","val":"DDD"};
      next[2] = prev[4];
      next[3] = {"id":"a","val":"AAA"};
      next[4] = {"id":"x","val":"xxx"};
      next.shift();
      // [{"id":"d","val":"DDD"},{"id":"e","val":"eee"},{"id":"a","val":"AAA"},{"id":"x","val":"xxx"}]
      expect(objectDiff(prev, next)).toStrictEqual([
        '[{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  update 3 {"id":"d","val":"DDD"}',
        '[{"id":"a","val":"AAA"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  update 0 {"id":"a","val":"AAA"}',
        '[{"id":"a","val":"AAA"},{"id":"b","val":"bbb"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  remove 2',
        '[{"id":"a","val":"AAA"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  remove 1',
        '[{"id":"a","val":"AAA"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"},{"id":"x","val":"xxx"}]  |  push {"id":"x","val":"xxx"}',
        '[{"id":"e","val":"eee"},{"id":"d","val":"DDD"},{"id":"a","val":"AAA"},{"id":"x","val":"xxx"}]  |  swap 0 2',
        '[{"id":"d","val":"DDD"},{"id":"e","val":"eee"},{"id":"a","val":"AAA"},{"id":"x","val":"xxx"}]  |  swap 0 1',
      ]);
    });

    test('sequence', () => {
      const prevArray: MapObject[] = [];
      const prevMap: PrevMap<MapObject> = new Map();
      const seqObjectDiff = (nextArray: MapObject[]) => genericDiff(
        stringifyArray, stringifyValue, prevArray, nextArray, 'id', prevMap
      );
      const check = (hasPrevMap: boolean, nextArray: MapObject[], ...steps: string[]) => {
        expect(seqObjectDiff(nextArray)).toStrictEqual(steps);
        expect(prevArray).toStrictEqual(nextArray);
        expect(prevMap).toStrictEqual(new Map(hasPrevMap ? nextArray.map(({id}, i) => [id, i]) : []));
      };

      const items = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}];

      check(
        true,
        items,
        '[{"id":"a","val":"aaa"}]  |  push {"id":"a","val":"aaa"}',
        '[{"id":"a","val":"aaa"},{"id":"b","val":"bbb"}]  |  push {"id":"b","val":"bbb"}',
        '[{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}]  |  push {"id":"c","val":"ccc"}',
      );

      let temp = items[0];
      items[0] = {"id":"b","val":"BBB"};
      items[1] = temp;
      items[2] = {"id":"d","val":"ddd"};
      items.push({"id":"e","val":"eee"});
      // [{"id":"b","val":"BBB"},{"id":"a","val":"aaa"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]

      check(
        true,
        items,
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"c","val":"ccc"}]  |  update 1 {"id":"b","val":"BBB"}',
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"d","val":"ddd"}]  |  replace 2 {"id":"d","val":"ddd"}',
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  push {"id":"e","val":"eee"}',
        '[{"id":"b","val":"BBB"},{"id":"a","val":"aaa"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  swap 0 1',
      );

      check(true, items); // no changes

      items[1] = {"id":"z","val":"zzz"};
      items[2] = {"id":"d","val":"DDD"};
      items.splice(2, 0, {"id":"y","val":"yyy"});
      items.unshift({"id":"x","val":"xxx"});
      // [{"id":"x","val":"xxx"},{"id":"b","val":"BBB"},{"id":"z","val":"zzz"},{"id":"y","val":"yyy"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]

      check(
        false,
        items,
        '[{"id":"b","val":"BBB"},{"id":"a","val":"aaa"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  update 2 {"id":"d","val":"DDD"}',
        '[{"id":"b","val":"BBB"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  remove 1',
        '[{"id":"x","val":"xxx"},{"id":"b","val":"BBB"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  insert 0 {"id":"x","val":"xxx"}',
        '[{"id":"x","val":"xxx"},{"id":"b","val":"BBB"},{"id":"z","val":"zzz"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  insert 2 {"id":"z","val":"zzz"}',
        '[{"id":"x","val":"xxx"},{"id":"b","val":"BBB"},{"id":"z","val":"zzz"},{"id":"y","val":"yyy"},{"id":"d","val":"DDD"},{"id":"e","val":"eee"}]  |  insert 3 {"id":"y","val":"yyy"}',
      );

      items[1] = items.pop()!;
      items.pop();
      items[3] = {"id":"a","val":"aaa"};
      temp = items[2];
      items[2] = items[3];
      items[3] = items[0];
      items[0] = temp;
      // [{"id":"z","val":"zzz"},{"id":"e","val":"eee"},{"id":"a","val":"aaa"},{"id":"x","val":"xxx"}]

      check(
        false,
        items,
        '[{"id":"x","val":"xxx"},{"id":"b","val":"BBB"},{"id":"z","val":"zzz"},{"id":"y","val":"yyy"},{"id":"e","val":"eee"}]  |  remove 4',
        '[{"id":"x","val":"xxx"},{"id":"b","val":"BBB"},{"id":"z","val":"zzz"},{"id":"e","val":"eee"}]  |  remove 3',
        '[{"id":"x","val":"xxx"},{"id":"z","val":"zzz"},{"id":"e","val":"eee"}]  |  remove 1',
        '[{"id":"x","val":"xxx"},{"id":"z","val":"zzz"},{"id":"a","val":"aaa"},{"id":"e","val":"eee"}]  |  insert 2 {"id":"a","val":"aaa"}',
        '[{"id":"e","val":"eee"},{"id":"z","val":"zzz"},{"id":"a","val":"aaa"},{"id":"x","val":"xxx"}]  |  swap 0 3',
        '[{"id":"z","val":"zzz"},{"id":"e","val":"eee"},{"id":"a","val":"aaa"},{"id":"x","val":"xxx"}]  |  swap 0 1',
      );
    });

  });

  describe('exception', () => {
    const _ = () => {};
    const props = {
      prevArray: [], nextArray: [],
      insert: _, remove: _, replace: _, swap: _, push: _, pop: _, update: _,
    };

    test('no update', () => expect(() => diff({
      ...props, key: 'id', update: undefined,
    })).toThrow(new RangeError('no "update" property provided')));

    test('prevArray duplicate value', () => expect(() => diff({
      ...props, prevArray: [1, 2, 3, 2, 4, 5]
    })).toThrow(new RangeError('prevArray duplicate: 2')));

    test('prevArray duplicate key', () => expect(() => diff({
      ...props, key: 'id', prevArray: [{id: 1}, {id: 1}, {id: 2}, {id: 3}]
    })).toThrow(new RangeError('prevArray duplicate: 1')));

    test('nextArray duplicate value', () => expect(() => diff({
      ...props, nextArray: [1, 2, 3, 3, 4, 5]
    })).toThrow(new RangeError('nextArray duplicate: 3')));

    test('nextArray duplicate key', () => expect(() => diff({
      ...props, key: 'id', nextArray: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 4}]
    })).toThrow(new RangeError('nextArray duplicate: 4')));
  });

});

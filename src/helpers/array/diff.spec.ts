
import {createDiff} from './diff';

describe('createDiff', () => {

  const toArray = (s: string) => {
    s = s.trim();
    return s ? s.split('  ') : [];
  };

  const createStringDiff = (prev: string) => {
    const prevArray = toArray(prev);
    const ctrlArray = [...prevArray];
    const padLength = prev.length - 4;
    const toString = () => `  ${ctrlArray.join('  ').padEnd(padLength, ' ')}  |  `;

    let result: string[];

    const diff = createDiff({
      prevArray,
      push: (value) => {
        ctrlArray.push(value);
        result.push(`${toString()}push ${value}`);
      },
      insert: (index, value) => {
        ctrlArray.splice(index, 0, value);
        result.push(`${toString()}insert ${index} ${value}`);
      },
      replace: (index, value) => {
        ctrlArray[index] = value;
        result.push(`${toString()}replace ${index} ${value}`);
      },
      swap: (prevIndex, nextIndex) => {
        const prev = ctrlArray[prevIndex];
        ctrlArray[prevIndex] = ctrlArray[nextIndex];
        ctrlArray[nextIndex] = prev;
        result.push(`${toString()}swap ${prevIndex} ${nextIndex}`);
      },
      pop: () => {
        ctrlArray.pop();
        result.push(`${toString()}pop`);
      },
      remove: (index) => {
        ctrlArray.splice(index, 1);
        result.push(`${toString()}remove ${index}`);
      },
    });

    return (next: string) => {
      result = [];
      diff(toArray(next));
      return result;
    };
  };

  interface MapObject {
    [k: string]: any;
  }

  const {stringify} = JSON;

  // const createCommonDiff = <T> (
  //   prevArray: T[], stringifyValue: (v: T) => string, stringifyArray: (a: T[]) => string
  // ) => {

  // };

  const createObjectDiff = (prevArray: MapObject[]) => {
    const ctrlArray = [...prevArray];
    const toString = () => `${stringify(ctrlArray)}  |  `;

    let result: string[];

    const diff = createDiff({
      prevArray,
      push: (value) => {
        ctrlArray.push(value);
        result.push(`${toString()}push ${stringify(value)}`);
      },
      insert: (index, value) => {
        ctrlArray.splice(index, 0, value);
        result.push(`${toString()}insert ${index} ${stringify(value)}`);
      },
      replace: (index, value) => {
        ctrlArray[index] = value;
        result.push(`${toString()}replace ${index} ${stringify(value)}`);
      },
      swap: (prevIndex, nextIndex) => {
        const prev = ctrlArray[prevIndex];
        ctrlArray[prevIndex] = ctrlArray[nextIndex];
        ctrlArray[nextIndex] = prev;
        result.push(`${toString()}swap ${prevIndex} ${nextIndex}`);
      },
      pop: () => {
        ctrlArray.pop();
        result.push(`${toString()}pop`);
      },
      remove: (index) => {
        ctrlArray.splice(index, 1);
        result.push(`${toString()}remove ${index}`);
      },
      key: 'id',
      update: (index, value) => {
        ctrlArray[index] = value;
        result.push(`${toString()}update ${index} ${stringify(value)}`);
      },
    });

    return (nextArray: MapObject[]) => {
      result = [];
      diff(nextArray);
      return result;
    };
  };

  // Algorithm:
  // 1) update next
  // 2) replace/remove/pop previous in reverse
  // 3) insert/push next
  // 4) swap previous recursive

  describe('identity by value', () => {

    // const __createStringDiff = (prev: string) => {
    //   const diff = createCommonDiff(toArray(prev));
    // };

    describe('feature', () => {

      describe('remove', () => {
        test('1', () => expect(createStringDiff(
          '  a  b  c                       '
        )(
          '  b  c                          '
        )).toStrictEqual([
          '  b  c                          |  remove 0',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(createStringDiff(
          '  a  b  c  d  e  f  g  h  i  j  '
        )(
          '  a  e  f  g  h  i  j           '
        )).toStrictEqual([
          '  a  b  c  e  f  g  h  i  j     |  remove 3',
          '  a  b  e  f  g  h  i  j        |  remove 2',
          '  a  e  f  g  h  i  j           |  remove 1',
        ]));
      });

      describe('insert', () => {
        test('1', () => expect(createStringDiff(
          '  b  c                          '
        )(
          '  a  b  c                       '
        )).toStrictEqual([
          '  a  b  c                       |  insert 0 a',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(createStringDiff(
          '  a  b  c  d  e  f  g           '
        )(
          '  a  b  x  y  z  c  d  e  f  g  '
        )).toStrictEqual([
          '  a  b  x  c  d  e  f  g        |  insert 2 x',
          '  a  b  x  y  c  d  e  f  g     |  insert 3 y',
          '  a  b  x  y  z  c  d  e  f  g  |  insert 4 z',
        ]));
      });

      describe('pop', () => {
        test('1', () => expect(createStringDiff(
          '  a  b  c                       '
        )(
          '  a  b                          '
        )).toStrictEqual([
          '  a  b                          |  pop',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(createStringDiff(
          '  a  b  c  d  e  f  g           '
        )(
          '  a  b  c  d                    '
        )).toStrictEqual([
          '  a  b  c  d  e  f              |  pop',
          '  a  b  c  d  e                 |  pop',
          '  a  b  c  d                    |  pop',
        ]));
      });

      describe('push', () => {
        test('1', () => expect(createStringDiff(
          '  a  b                          '
        )(
          '  a  b  c                       '
        )).toStrictEqual([
          '  a  b  c                       |  push c',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(createStringDiff(
          '                                '
        )(
          '  a  b  c                       '
        )).toStrictEqual([
          '  a                             |  push a',
          '  a  b                          |  push b',
          '  a  b  c                       |  push c',
        ]));
      });

      describe('replace', () => {
        test('1', () => expect(createStringDiff(
          '  a  b  c                       '
        )(
          '  z  b  c                       '
        )).toStrictEqual([
          '  z  b  c                       |  replace 0 z',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3', () => expect(createStringDiff(
          '  a  b  c  d  e  f  g           '
        )(
          '  a  x  c  y  e  z  g           '
        )).toStrictEqual([
          '  a  b  c  d  e  z  g           |  replace 5 z',
          '  a  b  c  y  e  z  g           |  replace 3 y',
          '  a  x  c  y  e  z  g           |  replace 1 x',
        ]));
      });

      describe('swap', () => {
        test('1', () => expect(createStringDiff(
          '  a  b  c                       '
        )(
          '  c  b  a                       '
        )).toStrictEqual([
          '  c  b  a                       |  swap 0 2',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('2 recursive', () => expect(createStringDiff(
          '  a  b  c                       '
        )(
          '  c  a  b                       '
        )).toStrictEqual([
          '  b  a  c                       |  swap 0 1',
          '  c  a  b                       |  swap 0 2',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('3 recursive', () => expect(createStringDiff(
          '  a  b  c  d                    '
        )(
          '  d  a  b  c                    '
        )).toStrictEqual([
          '  b  a  c  d                    |  swap 0 1',
          '  c  a  b  d                    |  swap 0 2',
          '  d  a  b  c                    |  swap 0 3',
        ]));
        //   0  1  2  3  4  5  6  7  8  9  '
        test('2 recursive and 1', () => expect(createStringDiff(
          '  a  b  c  d  e  f  g           '
        )(
          '  c  g  e  d  a  f  b           '
        )).toStrictEqual([
          '  e  b  c  d  a  f  g           |  swap 0 4',
          '  c  b  e  d  a  f  g           |  swap 0 2',
          '  c  g  e  d  a  f  b           |  swap 1 6',
        ]));
      });

    });

    describe('random', () => {
      test('1', () => expect(createStringDiff(
        '  a  b  c  d  e  f              '
      )(
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
      test('2', () => expect(createStringDiff(
        '  a  b  c  d  e  f  g  h  i  j  '
      )(
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
      test('3', () => expect(createStringDiff(
        '  d  r  y  s  f  w  h  t        '
      )(
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
      test('4', () => expect(createStringDiff(
        '  f  m  r  u  q  c  v  p  a  y  '
      )(
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
      const diff = createStringDiff(
        '  a  b  c                       '
      );
      //   0  1  2  3  4  5  6  7  8  9  '
      expect(diff(
        '  a  b  c  d  e                 '
      )).toStrictEqual([
        '  a  b  c  d                    |  push d',
        '  a  b  c  d  e                 |  push e',
      ]);
      //   0  1  2  3  4  5  6  7  8  9  '
      expect(diff(
        '  a  x  d  e  f  g              '
      )).toStrictEqual([
        '  a  b  d  e                    |  remove 2',
        '  a  x  d  e                    |  replace 1 x',
        '  a  x  d  e  f                 |  push f',
        '  a  x  d  e  f  g              |  push g',
      ]);
      //   0  1  2  3  4  5  6  7  8  9  '
      expect(diff(
        '  g  x  y  z  e  d  l  f  t  p  '
      )).toStrictEqual([
        '  x  d  e  f  g                 |  remove 0',
        '  x  d  y  e  f  g              |  insert 2 y',
        '  x  d  y  z  e  f  g           |  insert 3 z',
        '  x  d  y  z  e  f  l  g        |  insert 6 l',
        '  x  d  y  z  e  f  l  g  t     |  push t',
        '  x  d  y  z  e  f  l  g  t  p  |  push p',
        '  d  x  y  z  e  f  l  g  t  p  |  swap 0 1',
        '  f  x  y  z  e  d  l  g  t  p  |  swap 0 5',
        '  g  x  y  z  e  d  l  f  t  p  |  swap 0 7',
      ]);
      //   0  1  2  3  4  5  6  7  8  9  '
      expect(diff(
        '  f  s  l  z  y  t  b  e        '
      )).toStrictEqual([
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
      ]);
    });

  });

  describe('identity by key with update', () => {

    test('no changes', () => {
      const same = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}];
      expect(createObjectDiff(same)(same)).toStrictEqual([]);
    });

    test('update', () => {
      const prev = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}];
      const next = [...prev]; next[1] = {"id":"b","val":"BBB"};
      expect(createObjectDiff(prev)(next)).toStrictEqual([
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
      expect(createObjectDiff(prev)(next)).toStrictEqual([
        '[{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"}]  |  update 2 {"id":"c","val":"CCC"}',
        '[{"id":"a","val":"aaa"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"}]  |  remove 1',
        '[{"id":"x","val":"xxx"},{"id":"a","val":"aaa"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"}]  |  insert 0 {"id":"x","val":"xxx"}',
        '[{"id":"x","val":"xxx"},{"id":"a","val":"aaa"},{"id":"c","val":"CCC"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  push {"id":"e","val":"eee"}',
        '[{"id":"x","val":"xxx"},{"id":"c","val":"CCC"},{"id":"a","val":"aaa"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  swap 1 2',
      ]);
    });

    test('random increase', () => {
      const prev = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}];
      const next = [...prev];
      next[1] = {"id":"d","val":"DDD"};
      next[2] = prev[4];
      next[3] = {"id":"a","val":"AAA"};
      next[4] = {"id":"x","val":"xxx"};
      next.shift();
      // [{"id":"d","val":"DDD"},{"id":"e","val":"eee"},{"id":"a","val":"AAA"},{"id":"x","val":"xxx"}]
      expect(createObjectDiff(prev)(next)).toStrictEqual([
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
      const prev = [{"id":"a","val":"aaa"},{"id":"b","val":"bbb"},{"id":"c","val":"ccc"}];
      const next = [...prev];
      next[0] = {"id":"b","val":"BBB"};
      next[1] = prev[0];
      next[2] = {"id":"d","val":"ddd"};
      next.push({"id":"e","val":"eee"});
      expect(createObjectDiff(prev)(next)).toStrictEqual([
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"c","val":"ccc"}]  |  update 1 {"id":"b","val":"BBB"}',
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"d","val":"ddd"}]  |  replace 2 {"id":"d","val":"ddd"}',
        '[{"id":"a","val":"aaa"},{"id":"b","val":"BBB"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  push {"id":"e","val":"eee"}',
        '[{"id":"b","val":"BBB"},{"id":"a","val":"aaa"},{"id":"d","val":"ddd"},{"id":"e","val":"eee"}]  |  swap 0 1',
      ]);
      // todo
    });


  });

  describe('exception', () => {
    const _ = () => {};
    const props = {insert: _, remove: _, replace: _, swap: _, push: _, pop: _};

    test('no update', () => expect(() => createDiff({
      ...props, key: 'id'
    })).toThrow(new RangeError('no "update" property provided')));

    test('no key', () => expect(() => createDiff({
      ...props, update: _,
    })).toThrow(new RangeError('no "key" property provided')));

    test('prevArray duplicate value', () => expect(() => createDiff({
      ...props, prevArray: [1, 2, 3, 2, 4, 5]
    })).toThrow(new RangeError('prevArray duplicate: 2')));

    test('prevArray duplicate key', () => expect(() => createDiff({
      ...props, key: 'id', update: _, prevArray: [{id: 1}, {id: 1}, {id: 2}, {id: 3}]
    })).toThrow(new RangeError('prevArray duplicate: 1')));

    test('nextArray duplicate value', () => expect(() => createDiff({
      ...props
    })(
      [1, 2, 3, 3, 4, 5]
    )).toThrow(new RangeError('nextArray duplicate: 3')));

    test('nextArray duplicate key', () => expect(() => createDiff({
      ...props, key: 'id', update: _
    })(
      [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 4}]
    )).toThrow(new RangeError('nextArray duplicate: 4')));
  });

});


import {indexedDiff} from './diff';

const toArray = (s: string) => {
  s = s.trim();
  return s ? s.split('  ') : [];
};

test.each([
  // * remove
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  ',
    '  b  c     |  remove 0',
    '  b  c     ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  h  i  j  ',
    '  a  b  c  e  f  g  h  i  j     |  remove 3',
    '  a  b  e  f  g  h  i  j        |  remove 2',
    '  a  e  f  g  h  i  j           |  remove 1',
    '  a  e  f  g  h  i  j           ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  // * insert
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  b  c     ',
    '  a  b  c  |  insert 0 a',
    '  a  b  c  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g           ',
    '  a  b  x  c  d  e  f  g        |  insert 2 x',
    '  a  b  x  y  c  d  e  f  g     |  insert 3 y',
    '  a  b  x  y  z  c  d  e  f  g  |  insert 4 z',
    '  a  b  x  y  z  c  d  e  f  g  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  // * pop
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  ',
    '  a  b     |  pop',
    '  a  b     ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  ',
    '  a  b  c  d  e  f     |  pop',
    '  a  b  c  d  e        |  pop',
    '  a  b  c  d           |  pop',
    '  a  b  c  d           ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  // * push
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b     ',
    '  a  b  c  |  push c',
    '  a  b  c  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '           ',
    '  a        |  push a',
    '  a  b     |  push b',
    '  a  b  c  |  push c',
    '  a  b  c  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  // * replace
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  ',
    '  z  b  c  |  replace 0 z',
    '  z  b  c  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  ',
    '  a  b  c  d  e  z  g  |  replace 5 z',
    '  a  b  c  y  e  z  g  |  replace 3 y',
    '  a  x  c  y  e  z  g  |  replace 1 x',
    '  a  x  c  y  e  z  g  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  // * swap
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  ',
    '  c  b  a  |  swap 0 2',
    '  c  b  a  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  ',
    '  b  a  c  |  swap 0 1',
    '  c  a  b  |  swap 0 2',
    '  c  a  b  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  ',
    '  b  a  c  d  |  swap 0 1',
    '  c  a  b  d  |  swap 0 2',
    '  d  a  b  c  |  swap 0 3',
    '  d  a  b  c  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  ',
    '  e  b  c  d  a  f  g  |  swap 0 4',
    '  c  b  e  d  a  f  g  |  swap 0 2',
    '  c  g  e  d  a  f  b  |  swap 1 6',
    '  c  g  e  d  a  f  b  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  // * random
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f              ',
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
    '  k  l  f  d  c  p  a  h  i  j  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  h  i  j  ',
    '  a  b  c  d  e  f  g  h  i     |  pop',
    '  a  b  c  d  e  g  h  i        |  remove 5',
    '  a  b  c  y  e  g  h  i        |  replace 3 y',
    '  a  b  y  e  g  h  i           |  remove 2',
    '  a  x  y  e  g  h  i           |  replace 1 x',
    '  a  x  y  e  z  g  h  i        |  insert 4 z',
    '  a  x  y  e  z  g  w  h  i     |  insert 6 w',
    '  a  x  e  y  z  g  w  h  i     |  swap 2 3',
    '  a  x  e  y  z  h  w  g  i     |  swap 5 7',
    '  a  x  e  y  z  h  w  g  i     ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  d  r  y  s  f  w  h  t        ',
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
    '  f  r  y  a  j  w  k  m  q  x  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  f  m  r  u  q  c  v  p  a  y  ',
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
    '  d  f  v  j  s  c  a           ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
])('%#. indexedDiff', (prev, ...expected) => {
  const next = expected.pop();

  expect(next).toStrictEqual(expected[expected.length - 1].split('|')[0]);

  const prevArray = toArray(prev as string);
  const items: string[] = [...prevArray];
  const result: string[] = [];
  const maxLength = Math.max((prev as string).length, (next as string).length) - 4;
  const toString = () => `  ${items.join('  ').padEnd(maxLength, ' ')}  |  `;

  indexedDiff({
    prevArray,
    push: (value) => {
      items.push(value);
      result.push(`${toString()}push ${value}`);
    },
    insert: (index, value) => {
      items.splice(index, 0, value);
      result.push(`${toString()}insert ${index} ${value}`);
    },
    replace: (index, value) => {
      items[index] = value;
      result.push(`${toString()}replace ${index} ${value}`);
    },
    swap: (prevIndex, nextIndex) => {
      const prev = items[prevIndex];
      items[prevIndex] = items[nextIndex];
      items[nextIndex] = prev;
      result.push(`${toString()}swap ${prevIndex} ${nextIndex}`);
    },
    pop: () => {
      items.pop();
      result.push(`${toString()}pop`);
    },
    remove: (index) => {
      items.splice(index, 1);
      result.push(`${toString()}remove ${index}`);
    },
  })(
    toArray(next as string)
  );

  expect(result).toStrictEqual(expected);
});

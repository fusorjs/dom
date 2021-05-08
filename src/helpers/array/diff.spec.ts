
import {indexedDiff} from './diff';

const toArray = (s: string) => {
  s = s.trim();
  return s ? s.split('  ') : [];
};

test.each([
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  h  i  j  ',
    '  a  b  c  e  f  g  h  i  j     |  remove 3',
    '  a  b  e  f  g  h  i  j        |  remove 2',
    '  a  e  f  g  h  i  j           |  remove 1',
    '  a  e  f  g  h  i  j           ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g           ',
    '  a  b  x  c  d  e  f  g        |  insert 2 x',
    '  a  b  x  y  c  d  e  f  g     |  insert 3 y',
    '  a  b  x  y  z  c  d  e  f  g  |  insert 4 z',
    '  a  b  x  y  z  c  d  e  f  g  '
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  ',
    '  a  b  c  d  e  f     |  pop',
    '  a  b  c  d  e        |  pop',
    '  a  b  c  d           |  pop',
    '  a  b  c  d           '
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
  [
    '  a  b  c  d  e  f  g  ',
    '  a  b  c  d  e  z  g  |  replace 5 z',
    '  a  b  c  y  e  z  g  |  replace 3 y',
    '  a  x  c  y  e  z  g  |  replace 1 x',
    '  a  x  c  y  e  z  g  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  ',
    '  e  b  c  d  a  f  g  |  swap 0 4',
    '  e  g  c  d  a  f  b  |  swap 1 6',
    '  c  g  e  d  a  f  b  |  swap 2 0',
    '  c  g  e  d  a  f  b  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f              ',
    '  a  l  c  d  e  f              |  replace 1 l', // insert k later
    '  a  l  f  d  e  c              |  swap 2 5',
    '  a  l  f  d  c  e              |  swap 4 5',
    '  a  l  f  d  c  p              |  replace 5 p',
    '  a  l  f  d  c  p  k           |  push k',
    '  k  l  f  d  c  p  a           |  swap 1 6',
    '  k  l  f  d  c  p  a  h  i  j  ', // todo
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  h  i  j  ',
    '  a  x  c  d  e  f  g  h  i  j  |  replace 1 x',
    '  a  x  d  e  f  g  h  i  j     |  remove 2',
    '  a  x  e  f  g  h  i  j        |  remove 2',
    '  a  x  e  y  g  h  i  j        |  replace 3 y',
    '  a  x  e  y  z  g  h  i  j     |  insert 4 z',
    '  a  x  e  y  z  h  w  g  i     ', // todo
  ],
  //   0  1  2  3  4  5  6  7  8  9
].map(
  ([prev, ...steps]) => [prev, steps.pop(), steps]
))(
  'indexedDiff(%p, %p)',
  (prev, next, expected) => {
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
    })(toArray(next as string));
    // console.log({prev, next, expected, result});
    expect(result).toStrictEqual(expected);
  }
);

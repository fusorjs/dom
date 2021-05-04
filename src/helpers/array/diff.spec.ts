
import {indexedDiff} from './diff';

const toArray = (s: string) => {
  s = s.trim();
  return s ? s.split('  ') : [];
};

// type Step = [state: string[], action: string];

// const toPairs = (acc: Step[], v: string, i: number, arr: readonly string[]) => {
//   if (i % 2 === 0) {
//     const [state, action] = arr.slice(i, i + 2);
//     acc.push([toArray(state), action]);
//   }
//   return acc;
// }

test.each([
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
    '  a  b  c  d  e  f  g  h  i  j  ',
    '  a  c  d  e  f  g  h  i  j     |  remove 1',
    '  a  d  e  f  g  h  i  j        |  remove 1',
    '  a  e  f  g  h  i  j           |  remove 1',
    '  a  e  f  g  h  i  j           ',
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
    '  a  b  c  d  e  f     |  pop',
    '  a  b  c  d  e        |  pop',
    '  a  b  c  d           |  pop',
    '  a  b  c  d           '
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  ',
    '  a  x  c  d  e  f  g  |  replace 1 x',
    '  a  x  c  y  e  f  g  |  replace 3 y',
    '  a  x  c  y  e  z  g  |  replace 5 z',
    '  a  x  c  y  e  z  g  ',
  ],
  //   0  1  2  3  4  5  6  7  8  9
  [
    '  a  b  c  d  e  f  g  ',
    '  c  b  a  d  e  f  g  |  swap 0 2',
    '  c  g  a  d  e  f  b  |  swap 1 6',
    '  c  g  e  d  a  f  b  |  swap 2 4',
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
  'indexedDiff',
  (prev, next, expected) => {
    const steps: string[] = [];
    indexedDiff({
      prevArray: toArray(prev as string),
      nextArray: toArray(next as string),
      push: (item) => steps.push(`push ${item}`),
      insert: (index, item) => steps.push(`insert ${index} ${item}`),
      replace: (index, item) => steps.push(`replace ${index} ${item}`),
      swap: (prevIndex, nextIndex) => steps.push(`swap ${prevIndex} ${nextIndex}`),
      pop: () => steps.push(`pop`),
      remove: (index) => steps.push(`remove ${index}`),
    });
    console.log({prev, next, expected, steps});
  }
);

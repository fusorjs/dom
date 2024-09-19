import {mathMlNamespace, svgNamespace} from './help/constants';
import {h, s, m} from './hyper';

test('h', () => {
  expect(h('a')).toStrictEqual(document.createElement('a'));
});

test('s', () => {
  expect(s('a')).toStrictEqual(document.createElementNS(svgNamespace, 'a'));
});

test('s', () => {
  expect(m('math')).toStrictEqual(
    document.createElementNS(mathMlNamespace, 'math'),
  );
});

import {stringify} from '@perform/common';
import {initChildren} from './init';

describe('initChildren', () => {
  const allPosibleCases = [
    ['', ''],
    ['1', '1'],
    ['abc', 'abc'],
    ['abc', 'abc'], // same
    ['', ''],
    [0, '0'],
    [-0, '0'],
    [-1, '-1'],
    [123, '123'],
    [123, '123'], // same
    [NaN, 'NaN'],
    [() => 222, '222'],
    [() => () => 333, '333'],
    [() => () => () => 444, '444'],
    [[], '[]'],
    [[1, 2, 3], '[1,2,3]'],
    [{}, '{}'],
    [{a: 1, b: 2}, '{"a":1,"b":2}'],
    [Symbol(), 'Symbol()'],
    [Symbol('sss'), 'Symbol(sss)'],
    [true, 'true'],
    [false, 'false'],
    [undefined, 'undefined'],
    [null, 'null'],
  ] as [a: any, b: any][];

  test.each([
    ...allPosibleCases,
    ...allPosibleCases.map(([p, e]) => [() => p, e]), // all dynamic
  ])('init single child %p toBe %p', (provided: any, expected: any) => {
    const element = document.createElement('div');
    initChildren(element, [provided]);
    expect(element.childNodes[0].nodeValue).toBe(expected);
  });

  test.each([
    [['Hello World!'], ['Hello World!']],
    [[42], ['42']],
    [['Hi! ', 'I am ', 21, ' years old.'], ['Hi! ', 'I am ', '21', ' years old.']],
    [[0], ['0']],
    [[NaN], ['NaN']],
    [[true, false, null, undefined], ['true', 'false', 'null', 'undefined']],
    [[], []],
    [[[], {}, Symbol()], ['[]', '{}', 'Symbol()']],
    [[[1, 2, 3], {a: 1, b: 2}, Symbol('sym')], ['[1,2,3]', '{"a":1,"b":2}', 'Symbol(sym)']],
    [[1, true, '2', false, 'x'], ['1', 'true', '2', 'false', 'x']],
  ])('init multiple static children %p toBe %p', (provided: readonly any[], expected: any[]) => {
    const element = document.createElement('div');
    const updaters = initChildren(element, provided);
    expect(updaters).toBeUndefined();
    expect(element.childNodes.length).toBe(expected.length);
    for (let i = 0, len = expected.length; i < len; i++) {
      expect(element.childNodes[i].nodeValue).toBe(expected[i]);
    }
  });

  // todo start here!

  describe('dynamic createUpdater', () => {

    describe('single child', () => {

      let dynamicValue: any;
      const dynamicChild = () => dynamicValue;
      const element = document.createElement('div');
      const updaters = initChildren(element, [dynamicChild]);
      expect(updaters?.length).toBe(1);
      updaters?.forEach(u => expect(typeof u).toBe('function'))
      expect(element.childNodes.length).toBe(1);

      describe('the same text node', () => {

        const theSameNode = element.childNodes[0];
        expect(theSameNode).toBeInstanceOf(Text);
        expect(theSameNode.nodeValue).toBe('undefined');

        test.each(
          allPosibleCases
        )('update %p toBe %p', (provided: any, expected: any) => {
          dynamicValue = provided;
          updaters?.forEach(u => u());
          expect(element.childNodes[0]).toBe(theSameNode);
          expect(theSameNode.nodeValue).toBe(expected);
        });

      });

      describe('switch nodes', () => {
        const elm1 = document.createElement('div');
        const elm2 = document.createElement('div');
        test.each([
          ['aaa'],
          [elm1],
          [elm2],
          [elm2],
          ['111'],
          [elm1],
          [elm1],
          ['bbb'],
          [elm2],
        ])('diferent nodes %p toBe %p', (val: any) => {
          dynamicValue = val;
          updaters?.forEach(u => u());
          if (val instanceof Node) expect(element.childNodes[0]).toBe(val);
          else expect(element.childNodes[0].nodeValue).toBe(val);
        });
      });

    });

    test('multiple children', () => {
      const element = document.createElement('div');
      const updaters = initChildren(element, [
        'static', () => 'dynamic', 111, () => document.createElement('div'),
      ]);
      expect(updaters?.length).toBe(2);
      expect(element.childNodes.length).toBe(4);
    });

    test('no children', () => {
      const element = document.createElement('div');
      const updaters = initChildren(element, []);
      expect(updaters).toBeUndefined()
      expect(element.childNodes.length).toBe(0);
    });

  });

});

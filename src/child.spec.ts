import {evaluate} from '@perform/common';

import { Updater } from './types';
import {initChild} from './child';

describe('initChildren', () => {
  const allStaticCases = [
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
    [document.createElement('div'), '<div></div>'],
    [document.createElementNS('http://www.w3.org/2000/svg', 'svg'), '<svg></svg>'],
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

  test.each(
    allStaticCases
  )('init single child %p toBe %p', (provided: any, expected: any) => {
    const element = document.createElement('div');
    const updater = initChild(element, provided);
    const node = element.childNodes[0];
    expect(updater).toBeUndefined();
    if (provided instanceof Element) {
      expect(node).toBe(provided);
      expect(element.innerHTML).toBe(expected);
    }
    else {
      expect(node).toBeInstanceOf(Text);
      expect(node.nodeValue).toBe(expected);
    }
  });

  describe('dynamic createUpdater', () => {

    const allDynamicCases = [
      ...allStaticCases.map(([p, e]) => [() => p, e]),
      ...allStaticCases.map(([p, e]) => [() => () => p, e]),
      ...allStaticCases.map(([p, e]) => [() => () => () => p, e]),
    ];

    test.each(
      allDynamicCases
    )('init single child %p toBe %p', (provided: any, expected: any) => {
      const element = document.createElement('div');
      const updater = initChild(element, provided) as Updater;
      expect(typeof updater).toBe('function');
      updater();
      const val = evaluate(provided);
      if (val instanceof Element) {
        expect(element.childNodes[0]).toBe(val);
        expect(element.innerHTML).toBe(expected);
      }
      else {
        const node = element.childNodes[0];
        expect(node).toBeInstanceOf(Text);
        expect(node.nodeValue).toBe(expected);
      }
    });

    describe('single child', () => {

      let dynamicValue: any;
      const dynamicChild = () => dynamicValue;
      const element = document.createElement('div');
      const updater = initChild(element, dynamicChild) as Updater;
      expect(typeof updater).toBe('function');
      expect(element.childNodes.length).toBe(1);

      describe('the same text node', () => {

        const theSameNode = element.childNodes[0];
        expect(theSameNode).toBeInstanceOf(Text);
        expect(theSameNode.nodeValue).toBe('');

        test.each([
          ...allStaticCases,
          ...allDynamicCases,
        ].filter(
          ([p]) => ! ((typeof p === 'function' ? evaluate(p) : p) instanceof Element)
        ))('update %p toBe %p', (provided: any, expected: any) => {
          dynamicValue = provided;
          updater();
          expect(element.childNodes[0]).toBe(theSameNode);
          expect(theSameNode.nodeValue).toBe(expected);
        });

      });

      {
        const e = document.createElement('p');

        test.each([
          ['aaa'],
          ['bbb'],
          ['bbb'],
          [document.createElement('div')],
          ['111'],
          [document.createElement('div')],
          [document.createElement('p')],
          ['222'],
          [e],
          [e],
          ['zzz'],
        ])('switch nodes %p toBe %p', (val: any) => {
          dynamicValue = val;
          updater();
          if (val instanceof Element) {
            expect(element.childNodes[0]).toBe(val);
          }
          else {
            const node = element.childNodes[0];
            expect(node).toBeInstanceOf(Text);
            expect(node.nodeValue).toBe(val);
          }
        });
      }

    });

  });

});

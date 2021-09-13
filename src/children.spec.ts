import {initChildren} from './children';
import {evaluate} from './utils';

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
    const updaters = initChildren(element, [provided]);
    const node = element.childNodes[0];
    expect(updaters).toBeUndefined();
    if (provided instanceof Element) {
      expect(node).toBe(provided);
      expect(element.innerHTML).toBe(expected);
    }
    else {
      expect(node).toBeInstanceOf(Text);
      expect(node.nodeValue).toBe(expected);
    }
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
      const node = element.childNodes[i];
      expect(node).toBeInstanceOf(Text);
      expect(node.nodeValue).toBe(expected[i]);
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
      const updaters = initChildren(element, [provided]);
      expect(updaters?.length).toBe(1);
      updaters?.forEach(u => expect(typeof u).toBe('function'));
      updaters?.forEach(u => u());
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
      const updaters = initChildren(element, [dynamicChild]);
      expect(updaters?.length).toBe(1);
      updaters?.forEach(u => expect(typeof u).toBe('function'))
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
          updaters?.forEach(u => u());
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
          updaters?.forEach(u => u());
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

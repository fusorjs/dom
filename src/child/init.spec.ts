import {initChildren} from './init';

describe('initChildren', () => {
  const emptyChildren = ['', true, false, null, undefined] as const;
  const illegalChildren = [
    [], {},
    // todo Symbol() TypeError: Cannot convert a Symbol value to a string
  ] as const;

  describe('static', () => {

    test.each([
      [['Hello World!'], ['Hello World!']],
      [[42], ['42']],
      [['Hi! ', 'I am ', 21, ' years old.'], ['Hi! ', 'I am ', '21', ' years old.']],
      [[0], ['0']],
      [[NaN], ['NaN']],
      [[], []],
      [emptyChildren, []],
      [[1, true, '2', false, 'x'], ['1', '2', 'x']],
    ])('%p toBe %p', (provided: readonly any[], expected: readonly string[]) => {
      const element = document.createElement('div');
      const updaters = initChildren(element, provided);
      expect(updaters).toBeUndefined();
      if (expected.length > 0) {
        expect(element.childNodes.length).toBe(expected.length);
        for (let i = 0, len = expected.length; i < len; i++) {
          expect(element.childNodes[i].nodeValue).toBe(expected[i]);
        }
      }
      else expect(element.childNodes.length).toBe(0);
    });

    test.each(
      illegalChildren.map(i => [[i]])
    )('illegal child %p', (provided: any[]) => {
      const element = document.createElement('div');
      expect(() => {
        initChildren(element, provided);
      }).toThrow(
        new TypeError(`illegal child value: ${provided[0]}`)
      );
    });

  });

  describe('dynamic', () => {

    describe('single child', () => {

      let dynamicValue: any;
      const dynamicChild = () => dynamicValue;
      const element = document.createElement('div');
      const updaters = initChildren(element, [dynamicChild]);
      expect(updaters?.length).toBe(1);
      const [updateElement] = updaters as [() => void];
      expect(typeof updateElement).toBe('function');
      expect(element.childNodes.length).toBe(1);

      describe('the same text node', () => {

        const theSameNode = element.childNodes[0];
        expect(theSameNode).toBeInstanceOf(Text);
        expect(theSameNode.nodeValue).toBe('');

        test.each(
          emptyChildren.map(i => [i])
        )('empty %p', (val: any) => {
          dynamicValue = val;
          updateElement();
          expect(element.childNodes[0]).toBe(theSameNode);
          expect(theSameNode.nodeValue).toBe('');
        });

        test.each([
          ['aaa', 'aaa'],
          ['aaa', 'aaa'], // same
          [0, '0'],
          ['', ''],
          [NaN, 'NaN'],
          [42, '42'],
          [true, ''],
          [() => 1, '1'],
          [() => () => 2, '2'],
          [() => () => () => 3, '3'],
          [() => () => () => () => 4, '4'],
          [() => () => () => () => () => 5, '5'],
        ])('%p toBe %p', (provided: any, expected: any) => {
          dynamicValue = provided;
          updateElement();
          expect(element.childNodes[0]).toBe(theSameNode);
          expect(theSameNode.nodeValue).toBe(expected);
        });

      });

      test('preventing indefinite recursion', () => {
        expect(() => {
          dynamicValue = () => () => () => () => () => () => 6, '6';
          updateElement();
        }).toThrow(
          new Error(`preventing indefinite recursion: 5`)
        );
      });

      test.each(
        illegalChildren.map(i => [[i]])
        // [() => () => () => () => () => () => 6, '6'],
      )('illegal child %p', (val: any[]) => {
        expect(() => {
          dynamicValue = val;
          updateElement();
        }).toThrow(
          new TypeError(`illegal child: ${dynamicChild} value: ${val}`)
        );
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
          updateElement();
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

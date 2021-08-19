import {initChildren} from './init';

describe('initChildren', () => {
  const skipableChildren = ['', true, false, null, undefined] as const;

  describe('static', () => {
    test.each([
      [['Hello World!'], ['Hello World!']],
      [[42], ['42']],
      [['Hi! ', 'I am ', 21, ' years old.'], ['Hi! ', 'I am ', '21', ' years old.']],
      [[0], ['0']],
      [[NaN], ['NaN']],
      [[], []],
      [skipableChildren, []],
      [[1, true, '2', false, 'x'], ['1', '2', 'x']],
    ])('children %p = %p', (provided: readonly any[], expected: readonly string[]) => {
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

    test.each([
      [[[]]],
      [[{}]],
      [[Symbol()]],
    ])('illegal child %p', (provided: any[]) => {
      const element = document.createElement('div');
      expect(() => {
        initChildren(element, provided);
      }).toThrow(
        new TypeError(`illegal child type: ${typeof provided[0]}`)
      );
    });

  });

  describe('dynamic child', () => {

    describe('all cases', () => {
      let current: any;
      const element = document.createElement('div');
      const updaters = initChildren(element, [() => current]);

      expect(updaters?.length).toBe(1);

      test('initial', () => {
        expect(element.childNodes.length).toBe(1);
        const node = element.childNodes[0];
        expect(node).toBeInstanceOf(Text);
        expect(node.nodeValue).toBe('');
      });

    });

  });

  describe('mixed', () => {

  });

});

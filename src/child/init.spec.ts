import {initChildren} from './init';

describe('initChildren', () => {

  describe('static', () => {

    test.each([
      [['Hello World!'], 'Hello World!'],
      [[42], '42'],
      [['Hi! ', 'I am ', 21, ' years old.'], 'Hi! I am 21 years old.'],
      [[0], '0'],
      [[NaN], 'NaN'],
      [[], ''],
      [['', true, false, null, undefined], ''],
      [[1, true, '2', false, 'x'], '12x'],
    ])('%p toBe %p', (provided: any[], expected: string) => {
      const buttonElement = document.createElement('button');
      const updaters = initChildren(buttonElement, provided);
      expect(updaters).toBeUndefined();
      if (expected) expect(buttonElement.innerHTML).toBe(expected);
      else expect(buttonElement.childNodes.length).toBe(0);
    });

    test.each([
      [[[]]],
      [[{}]],
      [[Symbol()]],
    ])('throw %p', (provided: any[]) => {
      const element = document.createElement('div');
      expect(() => {
        initChildren(element, provided);
      }).toThrow(
        new TypeError(`unsupported child type: ${typeof provided[0]}`)
      );
    });

  });

  describe('dynamic', () => {

    // todo check div(() => bool ? 'text node' : p('element'))


  });

});

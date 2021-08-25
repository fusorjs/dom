import {initProps} from './init';

describe('initProps', () => {
  const emptyProps = ['', false, null, undefined];

  describe('static', () => {

    test.each(
      emptyProps.map(i => [{title: i, tabIndex: i, hidden: i}])
    )('%p toBe default', (provided: any) => {
      const element = document.createElement('div');
      const updaters = initProps(element, provided);
      expect(updaters).toBeUndefined();
      expect(element.title).toBe('');
      expect(element.tabIndex).toBe(-1);
      expect(element.hidden).toBe(false);
    });

    test('event listeners', () => {
      let result = '';
      const element = document.createElement('div');
      const updaters = initProps(element, {
        onClick: () => result += '111'
      });
      expect(updaters).toBeUndefined();
      element.addEventListener('click', () => result += '222')
      element.click();
      expect(result).toBe('111222');
    });

    test('ref object', () => {
      const ref = {current: null};
      const element = document.createElement('div');
      const updaters = initProps(element, {ref});
      expect(updaters).toBeUndefined();
      expect(ref.current).toBe(element);
    });

    test('ref function', () => {
      const r = {current: null};
      const element = document.createElement('div');
      const updaters = initProps(element, {
        ref: (e: any) => r.current = e
      });
      expect(updaters).toBeUndefined();
      expect(r.current).toBe(element);
    });

    test.each([
      [{title: 'aaa'}],
      // todo [{style: 'color:red'}, {style: 'aaa'}],
      [{tabIndex: 55}],
      [{className: 'bbb'}],
      [{aaa: 111, bbb: 222, ccc: 'CCC'}],
    ])('%p toBe same', (provided: any) => {
      const element = document.createElement('div');
      const updaters = initProps(element, provided);
      expect(updaters).toBeUndefined();
      Object.entries(provided).forEach(([k, v]) => {
        expect(element[k as keyof HTMLDivElement]).toBe(v);
      });
    });

    test.each([
      [{onClick: 'str'}, new TypeError(`illegal property: onClick value: str`)],
      [{ref: 'str'}, new TypeError(`illegal property: ref value: str`)],
    ])('%p throws %p', (provided: any, expected: any) => {
      const element = document.createElement('div');
      expect(() => {
        initProps(element, provided);
      }).toThrow(
        expected
      );
    });

  });

});

// todo start here !!!

// test('set color style of text', () => {
//   const buttonElement = document.createElement('button');

//   initProps(buttonElement, {
//     style: 'color:red',
//     disabled: true,
//   });

//   expect(
//     buttonElement.outerHTML
//   ).toBe(
//     '<button style="color:red" disabled=""></button>' // todo just disabled
//   );
// });

// describe('boolean', () => {
//   describe('init', () => {
//     test('true', () => {
//       const buttonElement = document.createElement('button');

//       expect(
//         buttonElement.disabled
//       ).toStrictEqual(
//         false
//       );

//       initProps(buttonElement, {
//         disabled: true,
//       });

//       expect(
//         buttonElement.disabled
//       ).toStrictEqual(
//         true
//       );
//     });

//     const testInitProp = (propName: string, initialValue: any, expectedValue: boolean) => {
//       const buttonElement = document.createElement('button');

//       initProps(buttonElement, {
//         [propName]: initialValue,
//       });

//       expect(
//         buttonElement.disabled
//       ).toStrictEqual(
//         expectedValue
//       );

//       expect(
//         buttonElement.outerHTML
//       ).toBe(
//         expectedValue
//         ? '<button disabled=""></button>' // todo just disabled
//         : '<button></button>'
//       );
//     };

//     test.each([
//       ['disabled', '', false],
//       ['disabled', null, false],
//       ['disabled', undefined, false],
//       ['disabled', false, false],
//       ['disabled', true, true],
//       // ['disabled', 0, true],
//     ])('init %s %p %p', testInitProp);

//   });
// });


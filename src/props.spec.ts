import {initProps} from './props';

describe('initProps', () => {

  describe('static', () => {

    test('event listeners', () => {
      let result = '';
      const element = document.createElement('div');
      const updaters = initProps(element, {
        onclick: () => result += '111'
      });
      expect(updaters).toBeUndefined();
      element.addEventListener('click', () => result += '222')
      element.click();
      expect(result).toBe('111222');
    });

    // ! refs are deprecated
    // describe ('ref', () => {
    //   test('object', () => {
    //     const ref = {current: null};
    //     const element = document.createElement('div');
    //     const updaters = initProps(element, {ref});
    //     expect(updaters).toBeUndefined();
    //     expect(ref.current).toBe(element);
    //   });
    //   test('function', () => {
    //     const r = {current: null};
    //     const element = document.createElement('div');
    //     const updaters = initProps(element, {
    //       ref: (e: any) => r.current = e
    //     });
    //     expect(updaters).toBeUndefined();
    //     expect(r.current).toBe(element);
    //   });
    // });

    test.each([
      [{title: 'aaa'}],
      [{tabIndex: 55}],
      [{hidden: true}],
      [{className: 'bbb'}],
      [{aaa: 111, bbb: 222, ccc: 'CCC', ddd: true}],
    ])('%p toBe same', (provided: any) => {
      const element = document.createElement('div');
      const updaters = initProps(element, provided);
      expect(updaters).toBeUndefined();
      Object.entries(provided).forEach(([k, v]) => {
        expect(element[k as keyof HTMLDivElement]).toBe(v);
      });
    });

    test.each([
      [{class: 'ccc'}, {className: 'ccc'}],
      // [{for: 'fff'}, {htmlFor: 'fff'}], // ! deprecated as it for html only
    ])('%p toBe %p', (provided: any, expected: any) => {
      const element = document.createElement('div');
      const updaters = initProps(element, provided);
      expect(updaters).toBeUndefined();
      Object.entries(expected).forEach(([k, v]) => {
        expect(element[k as keyof HTMLDivElement]).toBe(v);
      });
    });

    test.each([
      [{onclick: 'str'}, new TypeError(`illegal property: "onclick" = "str"; expected function`)],
      // [{ref: 'str'}, new TypeError(`illegal property: "ref" = "str"; expected function or object`)], // ! deprecated
    ])('%p throws %p', (provided: any, expected: any) => {
      const element = document.createElement('div');
      expect(() => {
        initProps(element, provided);
      }).toThrow(
        expected
      );
    });

  });

  describe('dynamic', () => {

    const element = document.createElement('div');
    let title: any = 'initial', tabIndex: any = 123, hidden: any, alfa: any = () => () => 'aaa', beta: any = 'bbb';
    const updaters = initProps(element, {
      title: () => title, tabIndex: () => tabIndex, hidden: () => hidden, alfa: () => alfa, beta: () => beta
    });
    expect(updaters?.length).toBe(5);
    updaters?.forEach(u => expect(typeof u).toBe('function'))
    expect(element.title).toBe('initial');
    expect(element.tabIndex).toBe(123);
    expect(element.hidden).toBe(false);
    expect(element['alfa' as 'id']).toBe('aaa');
    expect(element['beta' as 'id']).toBe('bbb');

    test.each([
      [{title: 'aaa', tabIndex: 42, hidden: true}],
      [{title: '', tabIndex: 0, hidden: false}],
      [{title: 'bbb', tabIndex: -1, alfa: [1, 2], beta: {}}],
      [{alfa: {a: 1}, beta: null}],
    ])('%p toBe same', (provided: any) => {
      ({title,  tabIndex, hidden, alfa, beta} = provided);
      updaters?.forEach(u => u());
      Object.entries(provided).forEach(([k, v]) => {
        expect(element[k as keyof HTMLDivElement]).toBe(v);
      });
    });

    test.each([
      [{title: () => () => () => 'wow'}, 'wow'],
    ])('%p toBe %p', (provided: any, expected: any) => {
      ({title,  tabIndex, hidden, alfa, beta} = provided);
      updaters?.forEach(u => u());
      Object.entries(provided).forEach(([k, v]) => {
        expect(element[k as keyof HTMLDivElement]).toBe(expected);
      });
    });

  });

});

import {initProps} from './init';

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

    describe ('ref', () => {

      test('object', () => {
        const ref = {current: null};
        const element = document.createElement('div');
        const updaters = initProps(element, {ref});
        expect(updaters).toBeUndefined();
        expect(ref.current).toBe(element);
      });

      test('function', () => {
        const r = {current: null};
        const element = document.createElement('div');
        const updaters = initProps(element, {
          ref: (e: any) => r.current = e
        });
        expect(updaters).toBeUndefined();
        expect(r.current).toBe(element);
      });

    });

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
      [{for: 'fff'}, {htmlFor: 'fff'}],
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
      [{ref: 'str'}, new TypeError(`illegal property: "ref" = "str"; expected function or object`)],
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
    let title: any, tabIndex: any, hidden: any, alfa: any, beta: any = 'bbb';
    const updaters = initProps(element, {
      title: () => title, tabIndex: () => tabIndex, hidden: () => hidden, alfa: () => alfa, beta: () => beta
    });
    expect(updaters?.length).toBe(5);
    updaters?.forEach(u => expect(typeof u).toBe('function'))
    expect(element.title).toBe('undefined');
    expect(element.tabIndex).toBe(0);
    expect(element.hidden).toBe(false);
    expect(element['alfa' as 'id']).toBeUndefined();
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
      [() => 2, 2],
      [() => () => 3, 3],
      [() => () => () => 4, 4],
      [() => () => () => () => 5, 5],
    ])('%p toBe %p', (provided: any, expected: any) => {
      alfa = provided;
      updaters?.forEach(u => u());
      expect(element['alfa' as keyof HTMLDivElement]).toBe(expected);
    });

    test('prevent 6 recursion', () => {
      alfa = () => () => () => () => () => 6;
      expect(() => {
        updaters?.forEach(u => u());
      }).toThrow(
        new TypeError(`preventing indefinite recursion: 6`)
      );
    });

  });

});

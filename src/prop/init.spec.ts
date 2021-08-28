import {initProps} from './init';

describe('initProps', () => {
  const emptyProps = ['', false, null, undefined] as const;

  const initial = (() => {
    const e = document.createElement('div');
    return {
      title: e.title,
      tabIndex: e.tabIndex,
      hidden: e.hidden,
    };
  })();

  describe('static', () => {

    test.each(
      emptyProps.map(i => [{title: i, tabIndex: i, hidden: i}])
    )('%p toBe default', (provided: any) => {
      const element = document.createElement('div');
      const updaters = initProps(element, provided);
      expect(updaters).toBeUndefined();
      expect(element.title).toBe(initial.title);
      expect(element.tabIndex).toBe(initial.tabIndex);
      expect(element.hidden).toBe(initial.hidden);
    });

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
      // todo [{style: 'color:red'}, {style: 'aaa'}],...
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
      [{class: 'bbb'}, {className: 'bbb'}],
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
      [{obj: {}}, new TypeError(`illegal property: "obj" = {}`)],
      [{arr: []}, new TypeError(`illegal property: "arr" = []`)],
      [{sym: Symbol()}, new TypeError(`illegal property: "sym" = Symbol()`)],
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

    describe('primitives', () => {

      const element = document.createElement('div');
      let dynamicTitle: any, dynamicTabIndex: any, dynamicHidden: any;
      const updaters = initProps(element, {
        title: () => dynamicTitle, tabIndex: () => dynamicTabIndex, hidden: () => dynamicHidden,
      });
      expect(updaters?.length).toBe(3);

      test.each(
        emptyProps.map(i => [i])
      )('%p toBe default', (provided) => {
        dynamicTitle = dynamicTabIndex = dynamicHidden = provided;
        updaters?.forEach(u => u());
        expect(element.title).toBe(initial.title);
        expect(element.tabIndex).toBe(initial.tabIndex);
        expect(element.hidden).toBe(initial.hidden);
      });

    });

  });

});

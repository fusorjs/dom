import {initProp} from './prop';

describe('initProp', () => {

  describe('static', () => {

    test('event listener', () => {
      let result = '';
      const element = document.createElement('div');
      const updater = initProp(element, 'onclick', () => result += '111');
      expect(updater).toBeUndefined();
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
      ['title', 'aaa'],
      ['tabIndex', 55],
      ['hidden', true],
      ['className', 'bbb'],
      ['aaa', 111],
      ['bbb', 222],
      ['ccc', 'CCC'],
      ['ddd', true],
    ])('key %p to be set to value %p', (key, val) => {
      const element = document.createElement('div');
      const updater = initProp(element, key, val);
      expect(updater).toBeUndefined();
      expect(element[key as keyof HTMLDivElement]).toBe(val);
    });

    test.each([
      ['class', 'className', 'ccc'],
      // ['for', 'htmlFor', 'fff'], // ! deprecated as it for html only
    ])('key %p to become key %p and set with value %p', (providedKey, expectedKey, value) => {
      const element = document.createElement('div');
      const updater = initProp(element, providedKey, value);
      expect(updater).toBeUndefined();
      expect(element[expectedKey as keyof HTMLDivElement]).toBe(value);
    });

    test.each([
      ['onclick', 'str', new TypeError(`illegal property: "onclick" = "str"; expected function`)],
      // ['ref', 'str', new TypeError(`illegal property: "ref" = "str"; expected function or object`)], // ! deprecated
    ])('setting key %p with value %p throws error %p', (key, value, error) => {
      const element = document.createElement('div');
      expect(() => {
        initProp(element, key, value);
      }).toThrow(
        error
      );
    });

  });

  describe('dynamic', () => {

    const element = document.createElement('div');
    let title: any = 'initial', tabIndex: any = 123, hidden: any, alfa: any = () => () => 'aaa', beta: any = 'bbb';
    const updaters = [
      initProp(element, 'title', () => title),
      initProp(element, 'tabIndex', () => tabIndex),
      initProp(element, 'hidden', () => hidden),
      initProp(element, 'alfa', () => alfa),
      initProp(element, 'beta', () => beta),
    ];
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
      updaters?.forEach(u => u!());
      Object.entries(provided).forEach(([k, v]) => {
        expect(element[k as keyof HTMLDivElement]).toBe(v);
      });
    });

    test.each([
      [{title: () => () => () => 'wow'}, 'wow'],
    ])('%p toBe %p', (provided: any, expected: any) => {
      ({title,  tabIndex, hidden, alfa, beta} = provided);
      updaters?.forEach(u => u!());
      Object.entries(provided).forEach(([k, v]) => {
        expect(element[k as keyof HTMLDivElement]).toBe(expected);
      });
    });

  });

});

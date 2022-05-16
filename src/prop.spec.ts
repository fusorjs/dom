import {UpdatableProp} from './types';
import {convertProp, updateProp, initProp, useCapture, emptyProp} from './prop';
import {evaluate, getString} from './utils';
import {getStringTestData} from './test-data.spec';

test.each([
  ['', emptyProp],
  [null, emptyProp],
  [false, emptyProp],
  [emptyProp, emptyProp],
  [true, ''],
  ['other', 'other'],
])('convert prop provided %p expected %p', (provided, expected) => {
  expect(convertProp(provided)).toBe(expected);
});

describe('init prop event listener', () => {
  const element = {
    addEventListener: jest.fn(),
  };

  test('init prop event listener', () => {
    const name = 'click';
    const callback = () => {};
    const updater = initProp(element as any as Element, `on${name}`, callback);

    expect(updater).toBeUndefined();

    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith(
      name,
      callback,
      useCapture,
    );
  });
});

const key = 'myprop';

const propTestData = getStringTestData.map(
  ([p]) => [p, convertProp(typeof p === 'function' ? evaluate(p) : p)] as const,
);

describe('init prop', () => {
  const element = {
    setAttribute: jest.fn(),
  };

  test.each(propTestData)(
    `init prop provided %p expected %p <<< %p <<< %p`,
    (provided, expected) => {
      const result = initProp(element as any as Element, key, provided as any);

      // prop
      if (expected === emptyProp) {
        expect(element.setAttribute).not.toHaveBeenCalled();
      } else {
        expect(element.setAttribute).toHaveBeenCalledTimes(1);
        expect(element.setAttribute).toHaveBeenCalledWith(
          key,
          getString(expected),
        );
      }

      // updater
      if (typeof provided === 'function')
        expect(result).toEqual<UpdatableProp>({
          update: provided,
          value: expected,
        });
      else expect(result).toBeUndefined();
    },
  );
});

describe('update prop', () => {
  const element = {
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
  };

  let dynamic: any;

  const updatable: UpdatableProp = {
    update: () => dynamic,
    value: dynamic,
  };

  test.each(propTestData)(
    'update prop provided %p expected %p <<< %p <<< %p',
    (provided, expected) => {
      const isSame = expected === updatable.value; // before updater
      const isRemoved = expected === undefined;

      dynamic = provided;

      updateProp(element as any as Element, key, updatable);

      if (isSame) {
        expect(element.setAttribute).not.toHaveBeenCalled();
        expect(element.removeAttribute).not.toHaveBeenCalled();
      } else if (isRemoved) {
        expect(element.setAttribute).not.toHaveBeenCalled();
        expect(element.removeAttribute).toHaveBeenCalledTimes(1);
        expect(element.removeAttribute).toHaveBeenCalledWith(key);
      } else {
        expect(element.setAttribute).toHaveBeenCalledTimes(1);
        expect(element.setAttribute).toHaveBeenCalledWith(
          key,
          getString(expected),
        );
        expect(element.removeAttribute).not.toHaveBeenCalled();
      }
    },
  );
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
  [
    'onclick',
    'str',
    new TypeError(`illegal property: "onclick" = "str"; expected function`),
  ],
  // ['ref', 'str', new TypeError(`illegal property: "ref" = "str"; expected function or object`)], // ! deprecated
])('init prop key %p provided %p expected %p', (key, provided, error) => {
  expect(() => {
    initProp(document.createElement('div'), key, provided);
  }).toThrow(error);
});

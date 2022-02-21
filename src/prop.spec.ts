import {PropData} from './types';
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
  } as unknown as Element;

  test('init event listener prop', () => {
    const name = 'click';
    const callback = () => {};
    const updater = initProp(element, `on${name}`, callback);

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

const propTestData = getStringTestData.map(([p]) => [
  p,
  convertProp(typeof p === 'function' ? evaluate(p) : p),
]);

describe('init prop', () => {
  const element = {
    setAttribute: jest.fn(),
  } as unknown as Element;

  test.each(propTestData)(
    `init prop provided %p expected %p`,
    (provided, expected) => {
      const result = initProp(element, key, provided as any);

      if (expected === emptyProp) {
        expect(element.setAttribute).not.toHaveBeenCalled();
      } else {
        expect(element.setAttribute).toHaveBeenCalledTimes(1);
        expect(element.setAttribute).toHaveBeenCalledWith(
          key,
          getString(expected),
        );
      }

      if (typeof provided === 'function')
        expect(result).toEqual<PropData>({
          update: provided,
          value: expected,
        });
      else expect(result).toBeUndefined();
    },
  );
});

describe('update', () => {
  const element = {
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
  } as unknown as Element;

  let dynamic: any = undefined;

  const data: PropData = {
    update: () => dynamic,
    value: dynamic,
  };

  test.each(propTestData)(
    'update provided %p expected %p',
    (provided, expected) => {
      const isSame = expected === data.value;
      const isRemoved = expected === undefined;

      dynamic = provided;
      updateProp(element, key, data);

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
])('init key %p provided %p error %p', (key, provided, error) => {
  expect(() => {
    initProp(document.createElement('div'), key, provided);
  }).toThrow(error);
});

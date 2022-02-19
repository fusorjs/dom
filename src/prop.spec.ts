import {getStringTestData} from './test-data.spec';
import {prepareProp, PropData, updateProp, initProp, useCapture} from './prop';
import {Evaluable, evaluate} from './utils';

const preparePropTestData = (convert =>
  getStringTestData.map(
    // convert some values
    ([p, e]) =>
      (found => (found ? ([p, found[1]] as const) : ([p, e] as const)))(
        convert.find(([pp]) => p === pp),
      ),
  ))([
  ['', undefined],
  [null, undefined],
  [false, undefined],
  [undefined, undefined],
  [true, ''],
] as const);

test.each(preparePropTestData)(
  'prepare provided %p expected %p',
  (provided, expected) => {
    expect(prepareProp(provided)).toBe(expected);
  },
);

const updatePropTestData = preparePropTestData.map(
  // evaluate provided functions and prepare their expected values
  ([p, e]) =>
    typeof p === 'function'
      ? (p => [p, prepareProp(p)] as const)(evaluate(p as Evaluable<typeof p>))
      : ([p, e] as const),
);

const key = 'myprop';

const element = {
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(),
  addEventListener: jest.fn(),
} as unknown as Element;

describe('update', () => {
  let dynamic: any = undefined;

  const data: PropData = {
    callback: () => dynamic,
    value: dynamic,
  };

  test.each(updatePropTestData)(
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
        expect(element.setAttribute).toHaveBeenCalledWith(key, expected);
        expect(element.removeAttribute).not.toHaveBeenCalled();
      }

      expect(element.addEventListener).not.toHaveBeenCalled();
    },
  );
});

test('init event listener', () => {
  const name = 'click';
  const callback = () => {};
  const updater = initProp(element, `on${name}`, callback);

  expect(updater).toBeUndefined();

  expect(element.setAttribute).not.toHaveBeenCalled();
  expect(element.removeAttribute).not.toHaveBeenCalled();
  expect(element.addEventListener).toHaveBeenCalledTimes(1);
  expect(element.addEventListener).toHaveBeenCalledWith(
    name,
    callback,
    useCapture,
  );
});

test.each(updatePropTestData)(
  `init static provided %p expected %p`,
  (provided, expected) => {
    const isRemoved = expected === undefined;
    const updater = initProp(element, key, provided as any);

    expect(updater).toBeUndefined();

    if (isRemoved) {
      expect(element.setAttribute).not.toHaveBeenCalled();
    } else {
      expect(element.setAttribute).toHaveBeenCalledTimes(1);
      expect(element.setAttribute).toHaveBeenCalledWith(key, expected);
    }

    expect(element.removeAttribute).not.toHaveBeenCalled();
    expect(element.addEventListener).not.toHaveBeenCalled();
  },
);

test.each(
  preparePropTestData.map(
    // wrap provided in function
    ([p, e]) =>
      [
        () => p,
        typeof p === 'function'
          ? prepareProp(evaluate(p as Evaluable<typeof p>))
          : e,
      ] as const,
  ),
)(`init dynamic provided %p expected %p`, (provided, expected) => {
  const isRemoved = expected === undefined;
  const data = initProp(element, key, provided as any);

  expect(data).toEqual({
    callback: provided,
    value: expected,
  });

  if (isRemoved) {
    expect(element.setAttribute).not.toHaveBeenCalled();
  } else {
    expect(element.setAttribute).toHaveBeenCalledTimes(1);
    expect(element.setAttribute).toHaveBeenCalledWith(key, expected);
  }

  expect(element.removeAttribute).not.toHaveBeenCalled();
  expect(element.addEventListener).not.toHaveBeenCalled();
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
    initProp(element, key, provided);
  }).toThrow(error);
});

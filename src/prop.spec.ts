import {PropType, UpdatableProp} from './types';
import {convertAttr, updateProp, initProp, emptyAttr} from './prop';
import {evaluate, getString, ObjectIs} from './utils';
import {getStringTestData} from './test-data.spec';

test.each([
  ['', emptyAttr],
  [null, emptyAttr],
  [false, emptyAttr],
  [true, ''],
  [emptyAttr, emptyAttr],
  [123, 123],
  ['str', 'str'],
  (e => [e, e])({}),
])('convert prop provided %p expected %p', (provided, expected) => {
  expect(convertAttr(provided)).toBe(expected);
});

describe('init prop event listener', () => {
  const element = {
    addEventListener: jest.fn(),
  };

  test('init prop event listener', () => {
    const name = 'click';
    const callback = () => {};
    const updater = initProp(
      element as any as Element,
      name,
      callback,
      PropType.BUBBLING_EVENT,
    );

    expect(updater).toBeUndefined();

    expect(element.addEventListener).toHaveBeenCalledTimes(1);
    expect(element.addEventListener).toHaveBeenCalledWith(
      name,
      callback,
      false,
    );
  });
});

const myPropName = 'myPropName'; // not standard

const propTestData = [true, false]
  .map(isAttr =>
    getStringTestData.map(
      ([p, e1]) =>
        [
          isAttr,
          p,
          (e => (isAttr ? convertAttr(e) : e))(
            typeof p === 'function' ? evaluate(p) : p,
          ),
          e1,
        ] as const,
    ),
  )
  .flat();

const element = {
  setAttribute: jest.fn(),
  removeAttribute: jest.fn(), // used only in updater
  set myPropName(v: any) {},
};

const elementSetMyPropName = jest.spyOn(element, myPropName, 'set');

test.each(propTestData)(
  `init attribute %p provided %p expected %p <<< %p <<< %p`,
  (isAttr, provided, expected) => {
    const result = initProp(
      element as any as Element,
      myPropName,
      provided,
      isAttr ? PropType.ATTRIBUTE : PropType.PROPERTY,
    );

    // attribute
    if (isAttr) {
      if (expected === emptyAttr) {
        expect(element.setAttribute).not.toHaveBeenCalled();
      } else {
        expect(element.setAttribute).toHaveBeenCalledTimes(1);
        expect(element.setAttribute).toHaveBeenCalledWith(
          myPropName,
          getString(expected),
        );
      }

      expect(elementSetMyPropName).not.toHaveBeenCalled();
    }

    // property
    else {
      expect(element.setAttribute).not.toHaveBeenCalled();
      expect(elementSetMyPropName).toHaveBeenCalledTimes(1);
      expect(elementSetMyPropName).toHaveBeenCalledWith(expected);
    }

    // updater
    if (typeof provided === 'function')
      expect(result).toEqual<UpdatableProp>({
        update: provided,
        value: expected,
        isAttr,
      });
    else expect(result).toBeUndefined();
  },
);

describe('update prop', () => {
  let dynamic: any;

  const updatable: UpdatableProp = {
    update: () => dynamic,
    value: dynamic,
    isAttr: true,
  };

  test.each(propTestData)(
    'update attribute %p provided %p expected %p <<< %p <<< %p',
    (isAttr, provided, expected) => {
      const isSame = ObjectIs(expected, updatable.value); // before updater

      dynamic = provided;
      updatable.isAttr = isAttr;

      updateProp(element as any as Element, myPropName, updatable);

      if (isSame) {
        expect(element.setAttribute).not.toHaveBeenCalled();
        expect(element.removeAttribute).not.toHaveBeenCalled();
        expect(elementSetMyPropName).not.toHaveBeenCalled();
      } else {
        if (isAttr) {
          if (expected === emptyAttr) {
            expect(element.setAttribute).not.toHaveBeenCalled();
            expect(element.removeAttribute).toHaveBeenCalledTimes(1);
            expect(element.removeAttribute).toHaveBeenCalledWith(myPropName);
          } else {
            expect(element.setAttribute).toHaveBeenCalledTimes(1);
            expect(element.setAttribute).toHaveBeenCalledWith(
              myPropName,
              getString(expected),
            );
            expect(element.removeAttribute).not.toHaveBeenCalled();
          }

          expect(elementSetMyPropName).not.toHaveBeenCalled();
        } else {
          expect(element.setAttribute).not.toHaveBeenCalled();
          expect(element.removeAttribute).not.toHaveBeenCalled();
          expect(elementSetMyPropName).toHaveBeenCalledTimes(1);
          expect(elementSetMyPropName).toHaveBeenCalledWith(expected);
        }
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
    'click',
    'str',
    new TypeError(`illegal event: "click" value: "str" expected: function`),
  ],
  // ['ref', 'str', new TypeError(`illegal property: "ref" = "str"; expected function or object`)], // ! deprecated
])('init prop key %p provided %p expected %p', (key, provided, error) => {
  expect(() => {
    initProp(
      document.createElement('div'),
      key,
      provided,
      PropType.BUBBLING_EVENT,
    );
  }).toThrow(error);
});

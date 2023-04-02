import {
  UpdatableChild,
  SingleChild,
  UpdatableChildren,
  ChildCache,
} from './types';
import {
  convertChild,
  convertChildNode,
  emptyChild,
  getChildNode,
  getNode,
  initChild,
  updateChild,
} from './child';
import {getString, ObjectIs} from './utils';
import {getStringTestData} from './test-data.spec';
import {Component} from './element';

test.each([
  [null, emptyChild],
  [true, emptyChild],
  [false, emptyChild],
  [undefined, emptyChild],
  [emptyChild, emptyChild],
  [123, 123],
  ['str', 'str'],
  (e => [e, e])({}),
])('convert child provided %p expected %p', (provided, expected) => {
  expect(convertChild(provided)).toBe(expected);
});

test.each([
  (v => [v, v])(document.createElement('div')),
  (v => [v, v.element])(new Component(document.createElement('div'))),
  (v => [v, document.createTextNode(getString(v))])('other'),
  (v => [v, document.createTextNode(getString(v))])(() => {}),
])('get child node provided %p expected %p', (provided, expected) => {
  if (expected instanceof Text)
    expect(getChildNode(provided)).toEqual(expected);
  else expect(getChildNode(provided)).toBe(expected);
});

type TestChild = [
  any,
  Omit<UpdatableChild | UpdatableChildren, 'update'>,
  string,
  string?,
];

const getCache = (value: any): ChildCache => ({
  value,
  node: convertChildNode(value),
});

const getUpdatable = (e: any) =>
  Array.isArray(e)
    ? {
        arrayRef: e,
        cache: e.map(e => (typeof e === 'function' ? e() : e)).map(getCache),
      }
    : {
        cache: getCache(e),
      };

describe('init child', () => {
  const element = {
    appendChild: jest.fn(),
  };

  test.each(
    getStringTestData.map<TestChild>(([p, e1, e2]) => [
      p,
      typeof p === 'function'
        ? getUpdatable(p())
        : {
            cache: getCache(p),
          },
      e1,
      e2,
    ]),
  )(
    'init child provided %p expected %p <<< %p <<< %p',
    (provided, expected) => {
      // const {value, node} = expected;
      const {cache} = expected;
      const result = initChild(element as any as Node, provided as SingleChild);

      // child
      if (Array.isArray(cache)) {
        if (cache.length === 0) {
          expect(element.appendChild).not.toHaveBeenCalled();
        } else {
          expect(element.appendChild).toHaveBeenCalledTimes(cache.length);

          for (let i = 0; i < cache.length; i++) {
            expect(element.appendChild.mock.calls[i][0]).toStrictEqual(
              cache[i].node,
            );
          }
        }
      } else {
        if (
          cache.node.nodeValue === emptyChild &&
          typeof provided !== 'function'
        ) {
          expect(element.appendChild).not.toHaveBeenCalled();
        } else {
          expect(element.appendChild).toHaveBeenCalledTimes(1);
          expect(element.appendChild).toHaveBeenCalledWith(cache.node);
        }
      }

      // result
      if (provided instanceof Component) {
        expect(result).toBe(provided);
      } else if (typeof provided === 'function') {
        expect(result).toEqual({
          update: provided,
          arrayRef: (expected as UpdatableChildren).arrayRef,
          cache,
        });
      } else {
        expect(result).toBeUndefined();
      }
    },
  );
});

describe('update child', () => {
  const element = {
    replaceChild: jest.fn(),
    replaceChildren: jest.fn(),
  };

  let dynamic: any;

  const updatable: UpdatableChild | UpdatableChildren = {
    update: () => dynamic,
    cache: getCache(dynamic),
  };

  test.each(
    getStringTestData.map<TestChild>(([p, e1, e2]) => [
      p,
      getUpdatable(typeof p === 'function' ? p() : p),
      e1,
      e2,
    ]),
  )(
    'update child provided %p expected %p <<< %p <<< %p',
    (provided, expected) => {
      const prevArrayRef = (updatable as any as UpdatableChildren).arrayRef; // before updater
      const {cache: prev} = updatable; // before updater

      dynamic = provided;

      updateChild(element as any as Element, updatable);

      const nextArrayRef = (expected as UpdatableChildren).arrayRef;
      const {cache: next} = expected;

      const currArrayRef = (updatable as any as UpdatableChildren).arrayRef;
      const {cache: curr} = updatable;

      expect(currArrayRef).toStrictEqual(nextArrayRef);
      expect(curr).toStrictEqual(next);

      // multiple
      if (Array.isArray(next) && Array.isArray(prev)) {
        if (nextArrayRef === prevArrayRef) {
          expect(element.replaceChild).not.toHaveBeenCalled();
          expect(element.replaceChildren).not.toHaveBeenCalled();
        } else {
          expect(element.replaceChild).not.toHaveBeenCalled();
          expect(element.replaceChildren).toHaveBeenCalledTimes(1);
          expect(element.replaceChildren).toHaveBeenCalledWith(
            ...next.map(getNode),
          );
        }
      } else if (Array.isArray(next)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(
          ...next.map(getNode),
        );
      } else if (Array.isArray(prev)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(next.node);
      }
      // single
      else if (ObjectIs(next.value, prev.value)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).not.toHaveBeenCalled();
      } else if (prev.node instanceof Text && next.node instanceof Text) {
        expect(element.replaceChildren).not.toHaveBeenCalled();
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(prev.node).toStrictEqual(next.node);
        expect(prev.node.nodeValue).toBe(getString(convertChild(next.value)));
      } else {
        expect(element.replaceChildren).not.toHaveBeenCalled();
        expect(element.replaceChild).toHaveBeenCalledTimes(1);
        expect(element.replaceChild).toHaveBeenCalledWith(next.node, prev.node);
      }
    },
  );
});

// describe('specific cases', () => {
//   const element = {
//     appendChild: jest.fn(),
//     replaceChild: jest.fn(),
//     replaceChildren: jest.fn(),
//   };

//   let dynamic: Child = 'text';

//   const app = initChild(element as any as Node, () => dynamic);

//   expect(element.appendChild).toHaveBeenCalledTimes(1);
//   expect(element.appendChild).toHaveBeenCalledWith(convertChildNode('text'));

//   let count = 0;

//   // dynamic =
// });

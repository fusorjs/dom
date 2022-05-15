import {UpdatableChild, Component, ChildCache, SingleChild} from './types';
import {
  convertChild,
  emptyChild,
  getChildCache,
  getChildNode,
  initChild,
  updateChild,
} from './child';
import {evaluate, getString} from './utils';
import {getStringTestData} from './test-data.spec';

test.each([
  [null, emptyChild],
  [undefined, emptyChild],
  [emptyChild, emptyChild],
  ['other', 'other'],
])('convert child provided %p expected %p', (provided, expected) => {
  expect(convertChild(provided)).toBe(expected);
});

test.each([
  (v => [v, v])(document.createElement('div')),
  (v => [v, v.getElement()])(new Component(document.createElement('div'))),
  (v => [v, document.createTextNode(getString(v))])('other'),
  (v => [v, document.createTextNode(getString(v))])(() => {}),
])('get child node provided %p expected %p', (provided, expected) => {
  if (expected instanceof Text)
    expect(getChildNode(provided)).toEqual(expected);
  else expect(getChildNode(provided)).toBe(expected);
});

describe('init child', () => {
  const element = {
    appendChild: jest.fn(),
  };

  test.each(
    getStringTestData.map(
      ([p, e1, e2]) =>
        [
          p,
          // getChildCache(typeof p === 'function' ? evaluate(p) : p),
          // (e => (Array.isArray(e) ? e.map(getChildCache) : getChildCache(e)))(
          //   typeof p === 'function' ? evaluate(p) : p,
          // ),
          typeof p === 'function'
            ? (e =>
                Array.isArray(e) ? e.map(getChildCache) : getChildCache(e))(
                evaluate(p),
              )
            : getChildCache(p),
          e1,
          e2,
        ] as const,
    ),
  )(
    'init child provided %p expected %p <<< %p <<< %p',
    (provided, expected) => {
      const result = initChild(element as any as Node, provided as SingleChild);

      // child
      if (Array.isArray(expected)) {
        if (expected.length === 0) {
          expect(element.appendChild).not.toHaveBeenCalled();
        } else {
          expect(element.appendChild).toHaveBeenCalledTimes(expected.length);

          for (let i = 0; i < expected.length; i++) {
            expect(element.appendChild.mock.calls[i][0]).toStrictEqual(
              expected[i].node,
            );
          }
        }
      } else {
        if (expected.value === emptyChild && typeof provided !== 'function') {
          expect(element.appendChild).not.toHaveBeenCalled();
        } else {
          expect(element.appendChild).toHaveBeenCalledTimes(1);
          expect(element.appendChild).toHaveBeenCalledWith(expected.node);
        }
      }

      // updater
      if (provided instanceof Component) {
        expect(result).toBe(provided);
      } else if (typeof provided === 'function') {
        expect(result).toEqual<UpdatableChild>({
          update: provided,
          cache: expected,
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

  const updatable: UpdatableChild = {
    update: () => dynamic,
    cache: {
      value: dynamic,
      node: getChildNode(dynamic),
    },
  };

  // const ssss = document.createElement('span');

  test.each(
    getStringTestData.map(
      // [
      //   // [[], '[]'],
      //   // [123, '123'],
      //   // [123, '123'],
      //   // [[1, 2, 3], '[1,2,3]'],
      //   // [document.createElement('span'), '<span></span>'],
      //   [ssss, '<span></span>'],
      //   [ssss, '<span></span>'],
      //   // ['abc', 'abc'],
      //   // [new Component(document.createElement('section')), '<section></section>'],
      // ].map(
      ([p, e1, e2]) =>
        [
          p,
          (e => (Array.isArray(e) ? e.map(getChildCache) : getChildCache(e)))(
            typeof p === 'function' ? evaluate(p) : p,
          ),
          e1,
          e2,
        ] as const,
    ),
  )(
    'update child provided %p expected %p <<< %p <<< %p',
    (provided, expected) => {
      // before updater
      // const isSame = expected.value === data.cache.value;
      // const prevNode = data.cache.node;
      const isSame = expected === updatable.cache;
      const previous = updatable.cache;
      const {previousValue, previousNode} = Array.isArray(updatable.cache)
        ? {previousValue: undefined, previousNode: undefined}
        : {
            previousValue: updatable.cache.value,
            previousNode: updatable.cache.node,
          };

      dynamic = provided;
      // console.log('<<<', updatable.cache);
      updateChild(element as any as Element, updatable);
      // console.log('>>>', updatable.cache, '\n');

      if (isSame) {
        // todo unreachable
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).not.toHaveBeenCalled();
      } else if (Array.isArray(expected) && Array.isArray(previous)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(
          ...expected.map(({node}) => node),
        );
      } else if (Array.isArray(expected)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(
          ...expected.map(({node}) => node),
        );
      } else if (Array.isArray(previous)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(expected.node);
      }
      // single
      else if (previousNode instanceof Text && expected.node instanceof Text) {
        expect(element.replaceChildren).not.toHaveBeenCalled();
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(previousNode).toStrictEqual(expected.node);
        expect((updatable.cache as ChildCache).value).toBe(expected.value);
      } else if (previousValue === expected.value) {
        expect(element.replaceChildren).not.toHaveBeenCalled();
        expect(element.replaceChild).not.toHaveBeenCalled();
      } else {
        expect(element.replaceChildren).not.toHaveBeenCalled();
        expect(element.replaceChild).toHaveBeenCalledTimes(1);
        expect(element.replaceChild).toHaveBeenCalledWith(
          expected.node,
          previousNode,
        );
      }
    },
  );
});

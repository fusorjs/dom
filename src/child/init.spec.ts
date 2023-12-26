import {
  UpdatableChild,
  SingleChild,
  UpdatableChildren,
  ChildCache,
} from '../types';
import {Component} from '../component';
import {getStringTestData} from '../test-data.spec';

import {convertChildNode, emptyChild} from './share';
import {initChild} from './init';

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
        cache: e.map((e) => (typeof e === 'function' ? e() : e)).map(getCache),
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

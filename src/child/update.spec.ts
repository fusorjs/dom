import {UpdatableChild, UpdatableChildren, ChildCache} from '../types';
import {getString, ObjectIs} from '../share';
import {getStringTestData} from '../test-data.spec';

import {convertChild, convertChildNode} from './share';
import {getNode, updateChild} from './update';

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

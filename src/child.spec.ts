import {UpdatableChild, SingleChild} from './types';
import {
  convertChild,
  convertChildNode,
  emptyChild,
  getChildNode,
  initChild,
  updateChild,
} from './child';
import {evaluate, getString, ObjectIs} from './utils';
import {getStringTestData} from './test-data.spec';
import {Component} from './element';

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
          typeof p === 'function'
            ? (e => ({
                value: e,
                node: Array.isArray(e)
                  ? e
                      .map(convertChild)
                      .filter(i => i !== emptyChild)
                      .map(getChildNode)
                  : convertChildNode(e),
              }))(evaluate(p))
            : {
                value: p,
                node: convertChildNode(p),
              },
          e1,
          e2,
        ] as const,
    ),
  )(
    'init child provided %p expected %p <<< %p <<< %p',
    (provided, {value, node}) => {
      const result = initChild(element as any as Node, provided as SingleChild);

      // child
      if (Array.isArray(node)) {
        if (node.length === 0) {
          expect(element.appendChild).not.toHaveBeenCalled();
        } else {
          expect(element.appendChild).toHaveBeenCalledTimes(node.length);

          for (let i = 0; i < node.length; i++) {
            expect(element.appendChild.mock.calls[i][0]).toStrictEqual(node[i]);
          }
        }
      } else {
        if (node.nodeValue === emptyChild && typeof provided !== 'function') {
          expect(element.appendChild).not.toHaveBeenCalled();
        } else {
          expect(element.appendChild).toHaveBeenCalledTimes(1);
          expect(element.appendChild).toHaveBeenCalledWith(node);
        }
      }

      // updater
      if (provided instanceof Component) {
        expect(result).toBe(provided);
      } else if (typeof provided === 'function') {
        expect(result).toEqual<UpdatableChild>({
          update: provided,
          value,
          node: node as any,
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
    value: dynamic,
    node: getChildNode(dynamic),
  };

  test.each(
    getStringTestData.map(
      ([p, e1, e2]) =>
        [
          p,
          (e => ({
            value: e,
            node: Array.isArray(e)
              ? e.map(convertChildNode)
              : convertChildNode(e),
          }))(typeof p === 'function' ? evaluate(p) : p),
          e1,
          e2,
        ] as const,
    ),
  )(
    'update child provided %p expected %p <<< %p <<< %p',
    (provided, {value: nextValue, node: nextNode}) => {
      const {value: prevValue, node: prevNode} = updatable; // before updater

      dynamic = provided;

      updateChild(element as any as Element, updatable);

      const {value: currValue, node: currNode} = updatable;

      expect(currValue).toStrictEqual(nextValue);
      expect(currNode).toStrictEqual(nextNode);

      if (ObjectIs(nextValue, prevValue)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).not.toHaveBeenCalled();
      } else if (Array.isArray(nextNode) && Array.isArray(prevNode)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(...nextNode);
      } else if (Array.isArray(nextNode)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(...nextNode);
      } else if (Array.isArray(prevNode)) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(element.replaceChildren).toHaveBeenCalledTimes(1);
        expect(element.replaceChildren).toHaveBeenCalledWith(nextNode);
      }
      // single
      else if (prevNode instanceof Text && nextNode instanceof Text) {
        expect(element.replaceChildren).not.toHaveBeenCalled();
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(prevNode).toStrictEqual(nextNode);
        expect(prevNode.nodeValue).toBe(getString(convertChild(nextValue)));
      } else {
        expect(element.replaceChildren).not.toHaveBeenCalled();
        expect(element.replaceChild).toHaveBeenCalledTimes(1);
        expect(element.replaceChild).toHaveBeenCalledWith(nextNode, prevNode);
      }
    },
  );
});

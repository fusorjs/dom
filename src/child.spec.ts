import {Child, ChildData, Component} from './types';
import {
  convertChild,
  emptyChild,
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

const childTestData = getStringTestData.map(
  ([p]) =>
    [
      p,
      ...(e => [e, getChildNode(e)] as const)(
        convertChild(typeof p === 'function' ? evaluate(p) : p),
      ),
    ] as const,
);

describe('init child', () => {
  const element = {
    appendChild: jest.fn(),
  };

  test.each(childTestData)(
    'init child provided %p expected %p',
    (provided, expected, node) => {
      const result = initChild(element as any as Node, provided as Child);

      // child
      if (expected === emptyChild && typeof provided !== 'function') {
        expect(element.appendChild).not.toHaveBeenCalled();
      } else {
        expect(element.appendChild).toHaveBeenCalledTimes(1);
        expect(element.appendChild).toHaveBeenCalledWith(node);
      }

      // updater
      if (provided instanceof Component) {
        expect(result).toBe(provided);
      } else if (typeof provided === 'function') {
        expect(result).toEqual<ChildData>({
          update: provided,
          value: expected,
          node,
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
  };

  let dynamic: any = undefined;

  const data: ChildData = {
    update: () => dynamic,
    value: dynamic,
    node: getChildNode(dynamic),
  };

  test.each(childTestData)(
    'update child provided %p expected %p',
    (provided, expected, node) => {
      const isSame = expected === data.value; // before updater
      const prevNode = data.node; // before updater

      dynamic = provided;
      updateChild(element as any as Element, data);

      if (isSame) {
        expect(element.replaceChild).not.toHaveBeenCalled();
      } else if (prevNode instanceof Text && node instanceof Text) {
        expect(element.replaceChild).not.toHaveBeenCalled();
        expect(data.value).toBe(expected);
      } else {
        expect(element.replaceChild).toHaveBeenCalledTimes(1);
        expect(element.replaceChild).toHaveBeenCalledWith(node, prevNode);
      }
    },
  );
});

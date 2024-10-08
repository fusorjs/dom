import {getElement, update} from '.';
import {init} from './init';
import {Component} from './component';
import {Arg, Fusion, StaticArg} from './types';

export interface CreatorNoConf {
  <E extends Element>(element: E, args: readonly StaticArg[]): E;
  <E extends Element>(element: E, args: readonly Arg[]): Component<E>;
}

test('init empty element', () => {
  const element = document.createElement('div');
  const result = init(element, []);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(0);
});

test('init element with static props', () => {
  const element = document.createElement('div');
  const result = init(element, [
    {
      title: 'hello',
      hidden: true,
      custom: 123,
    },
    {},
  ]);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(3);
  expect(element.childNodes.length).toBe(0);
  expect(element.title).toBe('hello');
  expect(element.hidden).toBe(true);
  expect(element.getAttribute('custom')).toEqual('123');
});

test('init element with static prop override', () => {
  const element = document.createElement('div');
  const result = init(element, [{id: 'one'}, {id: 'two'}]);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.id).toBe('two');
});

test('init element with dynamic prop', () => {
  let title = 'aaa';

  const element = document.createElement('div');
  const result = init(element, [{title: () => title}]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.title).toBe('aaa');

  title = 'bbb';
  update(result);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.title).toBe('bbb');
});

test('init element with dynamic prop override', () => {
  let dynamic1 = 111;
  let dynamic2 = 222;

  const element = document.createElement('div');
  const result = init(element, [
    {id: () => dynamic1++},
    {id: () => dynamic2++},
  ]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.id).toBe('222');

  expect(dynamic1).toBe(112);
  expect(dynamic2).toBe(223);

  update(result);

  expect(element.id).toBe('223');
  expect(dynamic1).toBe(112); // did not increment
  expect(dynamic2).toBe(224);
});

test('init element with event handler, it should be static', () => {
  const element = document.createElement('button');
  const result = init(element, [{click_e: () => {}}]);

  expect(result).toBe(element);

  // todo types check, change elemment to result:
  // expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
});

test('init element with static children', () => {
  const element = document.createElement('div');
  const result = init(element, ['one', 2, 'three']) as Element;

  expect(result).toBe(element);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(3);

  expect(result.childNodes[0].nodeValue).toBe('one');
  expect(result.childNodes[1].nodeValue).toBe('2');
  expect(result.childNodes[2].nodeValue).toBe('three');
});

test('init element with nested static child', () => {
  const element = document.createElement('div');
  const result = init(element, [
    init(document.createElement('p'), ['Hi!']),
  ]) as Element;

  expect(result).toBe(element);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(1);

  expect(result.outerHTML).toBe('<div><p>Hi!</p></div>');
});

test('init element with dynamic child', () => {
  let child = 123;

  const element = document.createElement('div');
  const result = init(element, [() => child]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  expect(element.childNodes[0].nodeValue).toBe('123');

  child = 456;
  update(result);

  expect(element.childNodes[0].nodeValue).toBe('456');
});

test('init element with nested dynamic child', () => {
  let count = 0;

  const element = document.createElement('div');
  const result = init(element, [
    init(document.createElement('p'), [() => ++count]),
  ]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  expect(element.outerHTML).toBe('<div><p>1</p></div>');

  update(result);

  expect(element.outerHTML).toBe('<div><p>2</p></div>');

  update(result);

  expect(element.outerHTML).toBe('<div><p>3</p></div>');

  update(result);

  expect(element.outerHTML).toBe('<div><p>4</p></div>');
});

describe('init element changing nested dynamic child', () => {
  let child: any = init(document.createElement('p'), ['Hi!']);

  const element = document.createElement('div');
  const result = init(element, [() => child]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  expect(element.childNodes[0]).toBe(child);

  const one = init(document.createElement('h1'), ['one']);
  const two = init(document.createElement('h2'), ['two']);

  test.each([
    ['aaa'],
    [one],
    [two],
    [two],
    ['111'],
    [init(document.createElement('p'), ['Hello!'])],
    [init(document.createElement('p'), [() => 'Hello!'])],
    [one],
    [one],
    ['bbb'],
    ['bbb'],
    [two],
    ['last'],
  ])('child %p toBe %p', (val) => {
    child = val;
    update(result);

    if (val instanceof Element) expect(element.childNodes[0]).toBe(val);
    else if (val instanceof Component)
      expect(element.childNodes[0]).toBe(val.element);
    else expect(element.childNodes[0].nodeValue).toBe(val);
  });
});

test('init element incrementing nested dynamic children', () => {
  let count = 0;
  let cache: Fusion;

  const element = document.createElement('div');
  const result = init(element, [
    init(document.createElement('p'), [() => ++count]),
    ' ',
    init(document.createElement('p'), [
      () =>
        cache
          ? update(cache)
          : (cache = init(document.createElement('span'), [() => ++count])),
    ]),
  ]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(3);

  expect(element.outerHTML).toBe('<div><p>1</p> <p><span>2</span></p></div>');

  update(result);

  expect(element.outerHTML).toBe('<div><p>3</p> <p><span>4</span></p></div>');

  update(result);

  expect(element.outerHTML).toBe('<div><p>5</p> <p><span>6</span></p></div>');
});

test.each([
  ['aaa', 'aaa'],
  [111, '111'],
  [init(document.createElement('p'), ['one']), '<p>one</p>'],
  [init(document.createElement('p'), [() => 'two']), '<p>two</p>'],
  [() => init(document.createElement('p'), ['three']), '<p>three</p>'],
  [() => init(document.createElement('p'), [() => 'four']), '<p>four</p>'],
  ['bbb', 'bbb'],
  ['bbb', 'bbb'],
])('init element with random child %p to be %p', (provided, expected) => {
  const element = document.createElement('div');
  const result = init(element, [provided]);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  if (typeof provided === 'function' || provided instanceof Component) {
    expect(result).toBeInstanceOf(Component);
    expect(getElement(result)).toBe(element);
  } else {
    expect(result).toBe(element);
  }

  expect(element.innerHTML).toBe(expected);
});

test('init element with dynamic prop and child', () => {
  let title = 'aaa';
  let child = 123;

  const element = document.createElement('div');
  const result = init(element, [{title: () => title}, () => child]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(1);

  expect(element.title).toBe('aaa');
  expect(element.childNodes[0].nodeValue).toBe('123');

  title = 'bbb';
  child = 456;
  update(result);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(1);

  expect(element.title).toBe('bbb');
  expect(element.childNodes[0].nodeValue).toBe('456');
});

test('init element with array of static children', () => {
  const element = document.createElement('div');
  const result = init(element, [
    'one',
    [111, 'aaa', 333],
    'two',
    [],
    ['three'],
  ]);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(6);

  expect(element.childNodes[0].nodeValue).toBe('one');
  expect(element.childNodes[1].nodeValue).toBe('111');
  expect(element.childNodes[2].nodeValue).toBe('aaa');
  expect(element.childNodes[3].nodeValue).toBe('333');
  expect(element.childNodes[4].nodeValue).toBe('two');
  expect(element.childNodes[5].nodeValue).toBe('three');
});

test('init element with dynamic array of children', () => {
  const element = document.createElement('div');
  const result = init(element, [[111, () => 'dynamic', () => [1, 2, 3]]]);

  expect(result).toBeInstanceOf(Component);
  expect(getElement(result)).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(6);

  expect(element.childNodes[0].nodeValue).toBe('111');
  expect(element.childNodes[1].nodeValue).toBe('dynamic');
  expect(element.childNodes[2].nodeValue).toBe('1');
  expect(element.childNodes[3].nodeValue).toBe('2');
  expect(element.childNodes[4].nodeValue).toBe('3');
  expect(element.childNodes[5].nodeValue).toBe(''); // terminator

  update(result);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(6);

  expect(element.childNodes[0].nodeValue).toBe('111');
  expect(element.childNodes[1].nodeValue).toBe('dynamic');
  expect(element.childNodes[2].nodeValue).toBe('1');
  expect(element.childNodes[3].nodeValue).toBe('2');
  expect(element.childNodes[4].nodeValue).toBe('3');
  expect(element.childNodes[5].nodeValue).toBe(''); // terminator
});

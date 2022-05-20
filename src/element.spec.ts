import {Component, initElement} from './element';
import {getPropConfig} from './config';

test('init empty element', () => {
  const element = document.createElement('div');
  const result = initElement(element, [], getPropConfig);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(0);
});

test('init element with static props', () => {
  const element = document.createElement('div');
  const result = initElement(
    element,
    [
      {
        title: 'hello',
        hidden: true,
        custom: 123,
      },
      {},
    ],
    getPropConfig,
  );

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(3);
  expect(element.childNodes.length).toBe(0);
  expect(element.title).toBe('hello');
  expect(element.hidden).toBe(true);
  expect(element.getAttribute('custom')).toEqual('123');
});

test('init element with static prop override', () => {
  const element = document.createElement('div');
  const result = initElement(
    element,
    [{id: 'one'}, {id: 'two'}],
    getPropConfig,
  );

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.id).toBe('two');
});

test('init element with dynamic prop', () => {
  let title = 'aaa';

  const element = document.createElement('div');
  const result = initElement(element, [{title: () => title}], getPropConfig);

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.title).toBe('aaa');

  title = 'bbb';
  result.update();

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.title).toBe('bbb');
});

test('init element with dynamic prop override', () => {
  let dynamic1 = 111;
  let dynamic2 = 222;

  const element = document.createElement('div');
  const result = initElement(
    element,
    [{id: () => dynamic1++}, {id: () => dynamic2++}],
    getPropConfig,
  );

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.id).toBe('222');

  expect(dynamic1).toBe(112);
  expect(dynamic2).toBe(223);

  result.update();

  expect(element.id).toBe('223');
  expect(dynamic1).toBe(112); // did not increment
  expect(dynamic2).toBe(224);
});

test('init element with event handler, it should be static', () => {
  const element = document.createElement('button');
  const result = initElement(element, [{onclick: () => {}}], getPropConfig);

  expect(result).toBe(element);

  // todo types check, change elemment to result:
  // expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
});

test('init element with static children', () => {
  const element = document.createElement('div');
  const result = initElement(element, ['one', 2, 'three'], getPropConfig);

  expect(result).toBe(element);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(3);

  expect(result.childNodes[0].nodeValue).toBe('one');
  expect(result.childNodes[1].nodeValue).toBe('2');
  expect(result.childNodes[2].nodeValue).toBe('three');
});

test('init element with nested static child', () => {
  const element = document.createElement('div');
  const result = initElement(
    element,
    [initElement(document.createElement('p'), ['Hi!'], getPropConfig)],
    getPropConfig,
  );

  expect(result).toBe(element);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(1);

  expect(result.outerHTML).toBe('<div><p>Hi!</p></div>');
});

test('init element with dynamic child', () => {
  let child = 123;

  const element = document.createElement('div');
  const result = initElement(element, [() => child], getPropConfig);

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  expect(element.childNodes[0].nodeValue).toBe('123');

  child = 456;
  result.update();

  expect(element.childNodes[0].nodeValue).toBe('456');
});

test('init element with nested dynamic child', () => {
  let count = 0;

  const element = document.createElement('div');
  const result = initElement(
    element,
    [initElement(document.createElement('p'), [() => ++count], getPropConfig)],
    getPropConfig,
  );

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  expect(element.outerHTML).toBe('<div><p>1</p></div>');

  result.update();

  expect(element.outerHTML).toBe('<div><p>2</p></div>');

  result.update();

  expect(element.outerHTML).toBe('<div><p>3</p></div>');

  result.update();

  expect(element.outerHTML).toBe('<div><p>4</p></div>');
});

describe('init element changing nested dynamic child', () => {
  let child: any = initElement(
    document.createElement('p'),
    ['Hi!'],
    getPropConfig,
  );

  const element = document.createElement('div');
  const result = initElement(element, [() => child], getPropConfig);

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  expect(element.childNodes[0]).toBe(child);

  const one = initElement(document.createElement('h1'), ['one'], getPropConfig);
  const two = initElement(document.createElement('h2'), ['two'], getPropConfig);

  test.each([
    ['aaa'],
    [one],
    [two],
    [two],
    ['111'],
    [initElement(document.createElement('p'), ['Hello!'], getPropConfig)],
    [initElement(document.createElement('p'), [() => 'Hello!'], getPropConfig)],
    [one],
    [one],
    ['bbb'],
    ['bbb'],
    [two],
    ['last'],
  ])('child %p toBe %p', val => {
    child = val;
    result.update();

    if (val instanceof Element) expect(element.childNodes[0]).toBe(val);
    else if (val instanceof Component)
      expect(element.childNodes[0]).toBe(val.getElement());
    else expect(element.childNodes[0].nodeValue).toBe(val);
  });
});

test('init element incrementing nested dynamic children', () => {
  let count = 0;

  const element = document.createElement('div');
  const result = initElement(
    element,
    [
      initElement(document.createElement('p'), [() => ++count], getPropConfig),
      ' ',
      initElement(
        document.createElement('p'),
        [
          () =>
            initElement(
              document.createElement('span'),
              [() => ++count],
              getPropConfig,
            ),
        ],
        getPropConfig,
      ),
    ],
    getPropConfig,
  );

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(3);

  expect(element.outerHTML).toBe('<div><p>1</p> <p><span>2</span></p></div>');

  result.update();

  expect(element.outerHTML).toBe('<div><p>3</p> <p><span>4</span></p></div>');

  result.update();

  expect(element.outerHTML).toBe('<div><p>5</p> <p><span>6</span></p></div>');
});

test.each([
  ['aaa', 'aaa'],
  [111, '111'],
  [
    initElement(document.createElement('p'), ['one'], getPropConfig),
    '<p>one</p>',
  ],
  [
    initElement(document.createElement('p'), [() => 'two'], getPropConfig),
    '<p>two</p>',
  ],
  [
    () => initElement(document.createElement('p'), ['three'], getPropConfig),
    '<p>three</p>',
  ],
  [
    () =>
      initElement(document.createElement('p'), [() => 'four'], getPropConfig),
    '<p>four</p>',
  ],
  ['bbb', 'bbb'],
  ['bbb', 'bbb'],
])('init element with random child %p to be %p', (provided, expected) => {
  const element = document.createElement('div');
  const result = initElement(element, [provided], getPropConfig);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);

  if (typeof provided === 'function' || provided instanceof Component) {
    expect(result).toBeInstanceOf(Component);
    expect(result.getElement()).toBe(element);
  } else {
    expect(result).toBe(element);
  }

  expect(element.innerHTML).toBe(expected);
});

test('init element with dynamic prop and child', () => {
  let title = 'aaa';
  let child = 123;

  const element = document.createElement('div');
  const result = initElement(
    element,
    [{title: () => title}, () => child],
    getPropConfig,
  );

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(1);

  expect(element.title).toBe('aaa');
  expect(element.childNodes[0].nodeValue).toBe('123');

  title = 'bbb';
  child = 456;
  result.update();

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(1);

  expect(element.title).toBe('bbb');
  expect(element.childNodes[0].nodeValue).toBe('456');
});

test('init element with array of static children', () => {
  const element = document.createElement('div');
  const result = initElement(
    element,
    ['one', [111, 'aaa', 333], 'two', [], ['three']],
    getPropConfig,
  );

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
  const result = initElement(
    element,
    [[111, () => 'dynamic', () => [1, 2, 3]]],
    getPropConfig,
  );

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(5);

  expect(element.childNodes[0].nodeValue).toBe('111');
  expect(element.childNodes[1].nodeValue).toBe('dynamic');
  expect(element.childNodes[2].nodeValue).toBe('1');
  expect(element.childNodes[3].nodeValue).toBe('2');
  expect(element.childNodes[4].nodeValue).toBe('3');

  result.update();

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(3);

  expect(element.childNodes[0].nodeValue).toBe('1');
  expect(element.childNodes[1].nodeValue).toBe('2');
  expect(element.childNodes[2].nodeValue).toBe('3');
});

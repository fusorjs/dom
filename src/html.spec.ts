import {Component} from './types';
import {div, button, p, form, select, option, textarea, a, img} from './html';

test('empty div', () => {
  const result = div();

  expect(result).toBeInstanceOf(HTMLDivElement);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(0);
});

test('staic div', () => {
  const result = div({class: '111'}, 'bbb');

  expect(result).toBeInstanceOf(HTMLDivElement);
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
});

test('dynamic div', () => {
  const result = div(() => 'bbb');

  expect(result).toBeInstanceOf(Component);

  const element = result.getElement();

  expect(element).toBeInstanceOf(HTMLDivElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
});

test('static button', () => {
  const result = button({aaa: '111'}, 'bbb');

  expect(result).toBeInstanceOf(HTMLButtonElement);
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
});

test('correct typescript typings', () => {
  expect(button().type).toBe('button'); // default override
  expect(form().enctype).toBe('application/x-www-form-urlencoded');
  expect(form().method).toBe('get');
  expect(select().multiple).toBe(false);
  expect(option().selected).toBe(false);
  expect(textarea().rows).toBe(2);
  expect(a().href).toBe('');
  expect(img().src).toBe('');
});

// 01.singleton

test('stateless button changes global counter onclick', () => {
  let counter = 0;

  const btn = button(
    {
      onclick: () => {
        counter += 1;
        btn.update();
      },
    },
    () => `Clicked ${counter} times!`,
  );

  expect(btn).toBeInstanceOf(Component);

  const element = btn.getElement();

  expect(element).toBeInstanceOf(HTMLButtonElement);

  expect(element.innerHTML).toBe('Clicked 0 times!');

  element.click();

  expect(element.innerHTML).toBe('Clicked 1 times!');

  element.click();
  element.click();

  expect(element.innerHTML).toBe('Clicked 3 times!');
});

// 02.multiple

test('stateful counter button instances are clicked', () => {
  const CounterButton = (counter = 0) => {
    const btn = button(
      {
        onclick: () => {
          counter += 1;
          btn.update();
        },
      },
      () => `Clicked ${counter} times!`,
    );

    return btn;
  };

  const element1 = CounterButton().getElement();
  const element2 = CounterButton().getElement();
  const element3 = CounterButton(333).getElement();

  expect(element1.innerHTML).toBe('Clicked 0 times!');
  expect(element2.innerHTML).toBe('Clicked 0 times!');
  expect(element3.innerHTML).toBe('Clicked 333 times!');

  element1.click();

  element2.click();
  element2.click();

  element3.click();
  element3.click();
  element3.click();

  expect(element1.innerHTML).toBe('Clicked 1 times!');
  expect(element2.innerHTML).toBe('Clicked 2 times!');
  expect(element3.innerHTML).toBe('Clicked 336 times!');
});

// 03.props

test('set color style of text', () => {
  expect(p({style: 'color:red'}, 'This text is red colored.').outerHTML).toBe(
    '<p style="color: red;">This text is red colored.</p>',
  );
});

// 04.child

test('toggle button color', () => {
  let toggle = false;

  const tgl = button(
    {
      onclick: () => {
        toggle = !toggle;
        tgl.update();
      },
    },
    () => (toggle ? 'On' : 'Off'),
  );

  let counter = 0;

  const cnt = button(
    {
      onclick: () => {
        counter += 1;
        cnt.update();
      },
      style: () => (toggle ? 'color:green' : ''),
    },
    () => `Clicked ${counter} times!`,
  );

  const toggleElement = tgl.getElement();
  const counterElement = cnt.getElement();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe(
    '<button type="button" style="">Clicked 0 times!</button>',
  );

  counterElement.click();
  counterElement.click();

  expect(counterElement.outerHTML).toBe(
    '<button type="button" style="">Clicked 2 times!</button>',
  );

  toggleElement.click();
  counterElement.click();
  counterElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('On');
  expect(counterElement.outerHTML).toBe(
    '<button type="button" style="color: green;">Clicked 5 times!</button>',
  );

  toggleElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe(
    '<button type="button" style="">Clicked 6 times!</button>',
  );

  toggleElement.click();

  expect(toggleElement.innerHTML).toBe('On');
});

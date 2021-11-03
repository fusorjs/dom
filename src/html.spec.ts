import {div, button, p} from './html';

test('empty div', () => {
  const result = div() as HTMLDivElement;
  expect(result).toBeInstanceOf(HTMLDivElement);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(0);
});

// 01.singleton

test('stateless button changes global counter onclick', () => {
  let counter = 0;

  const update = button(
    {onclick: () => {
      counter += 1;
      update();
    }},
    () => `Clicked ${counter} times!`
  ) as () => HTMLButtonElement;

  const element = update();

  expect(typeof update).toBe('function');
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
    const update = button(
      {onclick: () => {
        counter += 1;
        update();
      }},
      () => `Clicked ${counter} times!`
    ) as () => HTMLButtonElement;

    return update;
  };

  const element1 = CounterButton()();
  const element2 = CounterButton()();
  const element3 = CounterButton(333)();

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
  expect(
    (p({style: 'color:red'}, 'This text is red colored.') as HTMLElement).outerHTML
  ).toBe(
    '<p style="color: red;">This text is red colored.</p>'
  );
});

// 04.child

test('toggle button color', () => {
  let toggle = false;

  const toggleUpdate = button(
    {
      onclick: () => {
        toggle = ! toggle;
        toggleUpdate();
      }
    },
    () => toggle ? 'On' : 'Off',
  ) as () => HTMLButtonElement;

  let counter = 0;

  const counterUpdate = button(
    {
      onclick: () => {
        counter += 1;
        counterUpdate();
      },
      style: () => toggle ? 'color:green' : ''
    },
    () => `Clicked ${counter} times!`
  ) as () => HTMLButtonElement;

  const toggleElement = toggleUpdate();
  const counterElement = counterUpdate();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe('<button type="button" style="">Clicked 0 times!</button>');

  counterElement.click();
  counterElement.click();

  expect(counterElement.outerHTML).toBe('<button type="button" style="">Clicked 2 times!</button>');

  toggleElement.click();
  counterElement.click();
  counterElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('On');
  expect(counterElement.outerHTML).toBe('<button type="button" style="color: green;">Clicked 5 times!</button>');

  toggleElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe('<button type="button" style="">Clicked 6 times!</button>');

  toggleElement.click();

  expect(toggleElement.innerHTML).toBe('On');
});

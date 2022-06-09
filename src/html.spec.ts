import {Component, RECURSION_LIMIT} from './element';
import {div, button, p, form, select, option, textarea, a, img} from './html';
import {Child} from './types';

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
  expect(result.attributes.length).toBe(2);
  expect(result.childNodes.length).toBe(1);
  expect(result.outerHTML).toBe('<button type="button" aaa="111">bbb</button>');
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
    '<p style="color:red">This text is red colored.</p>',
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
    '<button type="button">Clicked 0 times!</button>',
  );

  counterElement.click();
  counterElement.click();

  expect(counterElement.outerHTML).toBe(
    '<button type="button">Clicked 2 times!</button>',
  );

  toggleElement.click();
  counterElement.click();
  counterElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('On');
  expect(counterElement.outerHTML).toBe(
    '<button type="button" style="color:green">Clicked 5 times!</button>',
  );

  toggleElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe(
    '<button type="button">Clicked 6 times!</button>',
  );

  toggleElement.click();

  expect(toggleElement.innerHTML).toBe('On');
});

test('init & update dynamic children array', () => {
  let count = 0;

  const counter = () => ++count;
  const app = div(() => [counter, p(counter)]);

  expect(app.getElement().innerHTML).toBe('2<p>1</p>'); // p's init called first
  expect(app.getElement().childNodes.length).toBe(2);

  app.update();

  expect(app.getElement().innerHTML).toBe('4<p>5</p>'); // p's recreated first then updated
  expect(app.getElement().childNodes.length).toBe(2);
});

test('dynamic children array', () => {
  let dynamic: Child = 'text';

  const app = div(() => dynamic, 123);

  expect(app.getElement().innerHTML).toBe('text123');
  expect(app.getElement().childNodes.length).toBe(2);

  dynamic = [1, 2, 3];
  app.update();

  expect(app.getElement().innerHTML).toBe('123');
  expect(app.getElement().childNodes.length).toBe(3);

  dynamic = ['a', 'b'];
  app.update();

  expect(app.getElement().innerHTML).toBe('ab');
  expect(app.getElement().childNodes.length).toBe(2);

  dynamic = 'one';
  app.update();

  expect(app.getElement().innerHTML).toBe('one');
  expect(app.getElement().childNodes.length).toBe(1);

  let count = 0;

  dynamic = p(() => ++count);
  app.update();

  expect(app.getElement().innerHTML).toBe('<p>2</p>'); // 2 - create + update
  expect(app.getElement().childNodes.length).toBe(1);

  app.update();

  expect(app.getElement().innerHTML).toBe('<p>3</p>');
  expect(app.getElement().childNodes.length).toBe(1);

  count = 1;
  dynamic = [p(() => count), () => count];
  app.update();

  expect(app.getElement().innerHTML).toBe('<p>1</p>1');
  expect(app.getElement().childNodes.length).toBe(2);

  count = 2;
  app.update();

  expect(app.getElement().innerHTML).toBe('<p>1</p>1'); // same array, does not update
  expect(app.getElement().childNodes.length).toBe(2);
});

it('should update dynamic array components whith different arrays', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic = [paragraph];

  const app = div(() => dynamic);

  expect(app.getElement().innerHTML).toBe('<p>1</p>');

  dynamic = [paragraph]; // different array
  app.update();

  expect(app.getElement().innerHTML).toBe('<p>2</p>');

  dynamic = [paragraph]; // different array
  app.update();

  expect(app.getElement().innerHTML).toBe('<p>3</p>');
});

it('should not update dynamic array components with the same array', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic = [paragraph];

  const app = div(() => dynamic);

  expect(app.getElement().innerHTML).toBe('<p>1</p>');

  app.update(); // same array

  expect(app.getElement().innerHTML).toBe('<p>1</p>');

  app.update(); // same array

  expect(app.getElement().innerHTML).toBe('<p>1</p>');
});

it('should replace dynamic array with dynamic component and update component', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic: Child = [paragraph];

  const app = div(() => dynamic);

  expect(app.getElement().innerHTML).toBe('<p>1</p>');

  dynamic = paragraph;
  app.update();

  expect(app.getElement().innerHTML).toBe('<p>2</p>');

  app.update();

  expect(app.getElement().innerHTML).toBe('<p>3</p>');
});

// it('should throw update recursion limit', () => {
//   expect(() => {
//     div([[div([div([div([div([div([div(div(div()))])])])])])]]);
//   }).toThrow(
//     new TypeError(
//       `update recursion limit has been reached: ${RECURSION_LIMIT}`,
//     ),
//   );
// });

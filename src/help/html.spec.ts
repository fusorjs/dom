import {Component} from '../component';
import {Child} from '../types';

import {htmlTagNames} from './constants';
import * as allTags from './html';
import {
  div,
  button,
  p,
  form,
  select,
  option,
  textarea,
  a,
  img,
  input,
} from './html';

test('all html tags are defined', () => {
  expect(htmlTagNames.filter((i) => !(allTags as any)[i])).toEqual(['var']);
  expect(allTags.hvar).toBeDefined();
});

test('empty div', () => {
  const result = div();

  expect(result).toBeInstanceOf(HTMLDivElement);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(0);
  expect(result.outerHTML).toBe('<div></div>');
});

test('staic div', () => {
  const result = div({class: '111'}, 'bbb');

  expect(result).toBeInstanceOf(HTMLDivElement);
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
  expect(result.outerHTML).toBe('<div class="111">bbb</div>');
});

test('dynamic div', () => {
  const result = div(() => 'bbb');

  expect(result).toBeInstanceOf(Component);

  const {element} = result;

  expect(element).toBeInstanceOf(HTMLDivElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
  expect(element.outerHTML).toBe('<div>bbb</div>');
});

it('has dynamic void child', () => {
  const result = p(() => {});

  expect(result).toBeInstanceOf(Component);

  const {element} = result;

  expect(element).toBeInstanceOf(HTMLParagraphElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
  expect(element.outerHTML).toBe('<p></p>');
});

test('static button', () => {
  const result = button({aaa: '111'}, 'bbb');

  expect(result).toBeInstanceOf(HTMLButtonElement);
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
  expect(result.outerHTML).toBe('<button aaa="111">bbb</button>');
});

test('correct typescript typings', () => {
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
      click_e: () => {
        counter += 1;
        btn.update();
      },
    },
    () => `Clicked ${counter} times!`,
  );

  expect(btn).toBeInstanceOf(Component);

  const {element} = btn;

  expect(element).toBeInstanceOf(HTMLButtonElement);

  expect(element.innerHTML).toBe('Clicked 0 times!');

  element.click();

  expect(element.innerHTML).toBe('Clicked 1 times!'); // todo 123132

  element.click();
  element.click();

  expect(element.innerHTML).toBe('Clicked 3 times!');
});

// 02.multiple

test('stateful counter button instances are clicked', () => {
  const CounterButton = (counter = 0) => {
    const btn = button(
      {
        click_e: () => {
          counter += 1;
          btn.update();
        },
      },
      () => `Clicked ${counter} times!`,
    );

    return btn;
  };

  const element1 = CounterButton().element;
  const element2 = CounterButton().element;
  const element3 = CounterButton(333).element;

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

test('init dynamic property', () => {
  let count = 0;

  expect(input({value: () => ++count}).element.value).toBe('1');
});

// 04.child

test('toggle button color', () => {
  let toggle = false;

  const tgl = button(
    {
      click_e: () => {
        toggle = !toggle;
        tgl.update();
      },
    },
    () => (toggle ? 'On' : 'Off'),
  );

  let counter = 0;

  const cnt = button(
    {
      click_e: () => {
        counter += 1;
        cnt.update();
      },
      style: () => (toggle ? 'color:green' : ''),
    },
    () => `Clicked ${counter} times!`,
  );

  const toggleElement = tgl.element;
  const counterElement = cnt.element;

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe(
    '<button style="">Clicked 0 times!</button>',
  );

  counterElement.click();
  counterElement.click();

  expect(counterElement.outerHTML).toBe(
    '<button style="">Clicked 2 times!</button>',
  );

  toggleElement.click();
  counterElement.click();
  counterElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('On');
  expect(counterElement.outerHTML).toBe(
    '<button style="color: green;">Clicked 5 times!</button>',
  );

  toggleElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe(
    '<button style="">Clicked 6 times!</button>',
  );

  toggleElement.click();

  expect(toggleElement.innerHTML).toBe('On');
});

test('init & update dynamic children array', () => {
  let count = 0;

  const counter = () => ++count;
  const app = div(() => [counter, p(counter)]);

  expect(app.element.innerHTML).toBe('2<p>1</p>'); // <p> init called first
  expect(app.element.childNodes.length).toBe(3);

  app.update();

  expect(app.element.innerHTML).toBe('4<p>3</p>'); // <p> re-created first
  expect(app.element.childNodes.length).toBe(3);
});

test('dynamic children array', () => {
  let dynamic: Child = 'text';

  const app = div(() => dynamic, 'WWW');

  expect(app.element.innerHTML).toBe('textWWW');
  expect(app.element.childNodes.length).toBe(2);

  dynamic = [1, 2, 3];
  app.update();

  expect(app.element.innerHTML).toBe('123WWW');
  expect(app.element.childNodes.length).toBe(5);

  dynamic = ['a', 'b'];
  app.update();

  expect(app.element.innerHTML).toBe('abWWW');
  expect(app.element.childNodes.length).toBe(4);

  dynamic = 'one';
  app.update();

  expect(app.element.innerHTML).toBe('oneWWW');
  expect(app.element.childNodes.length).toBe(3); // +1 terminator

  let count = 0;

  dynamic = p(() => ++count);

  app.update();

  expect(app.element.innerHTML).toBe('<p>1</p>WWW');
  expect(app.element.childNodes.length).toBe(3);

  app.update();

  expect(app.element.innerHTML).toBe('<p>1</p>WWW');
  expect(app.element.childNodes.length).toBe(3);

  dynamic.update();

  expect(app.element.innerHTML).toBe('<p>2</p>WWW');
  expect(app.element.childNodes.length).toBe(3);

  count = 1;
  dynamic = [p(() => count), () => count];
  app.update();

  expect(app.element.innerHTML).toBe('<p>1</p>1WWW');
  expect(app.element.childNodes.length).toBe(4);

  count = 2;
  app.update();

  expect(app.element.innerHTML).toBe('<p>1</p>1WWW'); // same array, does not update
  expect(app.element.childNodes.length).toBe(4);
});

it('should update dynamic array components whith different arrays', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic: any[] = [paragraph];

  const app = div(() => dynamic);

  expect(app.element.innerHTML).toBe('<p>1</p>');

  dynamic = [paragraph]; // different array
  app.update();

  expect(app.element.innerHTML).toBe('<p>1</p>');

  paragraph.update();

  expect(app.element.innerHTML).toBe('<p>2</p>');

  dynamic = ['abc']; // different array
  app.update();

  expect(app.element.innerHTML).toBe('abc');
});

it('should not update dynamic array components with the same array', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic = [paragraph];

  const app = div(() => dynamic);

  expect(app.element.innerHTML).toBe('<p>1</p>');

  app.update(); // same array

  expect(app.element.innerHTML).toBe('<p>1</p>');

  app.update(); // same array

  expect(app.element.innerHTML).toBe('<p>1</p>');
});

it('should replace dynamic array with dynamic component and update component', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic: Child = [paragraph];

  const app = div(() => dynamic);

  expect(app.element.innerHTML).toBe('<p>1</p>');

  dynamic = paragraph;

  app.update();

  expect(app.element.innerHTML).toBe('<p>1</p>');

  dynamic.update();

  expect(app.element.innerHTML).toBe('<p>2</p>');

  app.update();

  expect(app.element.innerHTML).toBe('<p>2</p>');
});

it('should not show boolean values', () => {
  expect(div(true).innerHTML).toBe('');
  expect(div(true || 'invisible').innerHTML).toBe('');
  expect(div(() => true).element.innerHTML).toBe('');
  expect(div(false).innerHTML).toBe('');
  expect(div(false && 'invisible').innerHTML).toBe('');
  expect(div(() => false).element.innerHTML).toBe('');
  expect(div([true, false]).innerHTML).toBe('');
  expect(div(() => [true, false]).element.innerHTML).toBe('');
  expect(div(() => [() => true, () => false]).element.innerHTML).toBe('');
});

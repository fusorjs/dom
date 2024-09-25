import {getElement, isUpdatable, update} from '../public';

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
  const result = div() as HTMLDivElement;

  expect(result).toBeInstanceOf(HTMLDivElement);
  expect(result.attributes.length).toBe(0);
  expect(result.childNodes.length).toBe(0);
  expect(result.outerHTML).toBe('<div></div>');
});

test('staic div', () => {
  const result = div({class: '111'}, 'bbb') as HTMLDivElement;

  expect(result).toBeInstanceOf(HTMLDivElement);
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
  expect(result.outerHTML).toBe('<div class="111">bbb</div>');
});

test('dynamic div', () => {
  const result = div(() => 'bbb');

  expect(isUpdatable(result)).toBe(true);

  const element = getElement(result);

  expect(element).toBeInstanceOf(HTMLDivElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
  expect(element.outerHTML).toBe('<div>bbb</div>');
});

it('has dynamic void child', () => {
  const result = p(() => {});

  expect(isUpdatable(result)).toBe(true);

  const element = getElement(result);

  expect(element).toBeInstanceOf(HTMLParagraphElement);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(1);
  expect(element.outerHTML).toBe('<p></p>');
});

test('static button', () => {
  const result = button({aaa: '111'}, 'bbb') as HTMLButtonElement;

  expect(result).toBeInstanceOf(HTMLButtonElement);
  expect(result.attributes.length).toBe(1);
  expect(result.childNodes.length).toBe(1);
  expect(result.outerHTML).toBe('<button aaa="111">bbb</button>');
});

test('correct typescript typings', () => {
  expect(getElement(form()).enctype).toBe('application/x-www-form-urlencoded');
  expect(getElement(form()).method).toBe('get');
  expect(getElement(select()).multiple).toBe(false);
  expect(getElement(option()).selected).toBe(false);
  expect(getElement(textarea()).rows).toBe(2);
  expect(getElement(a()).href).toBe('');
  expect(getElement(img()).src).toBe('');

  input({
    keydown_e: (event) => {
      if ((event as any as KeyboardEvent).code !== 'Enter') return;
      event.preventDefault();
      event.target.value.toUpperCase();
    },
  });
});

// 01.singleton

test('stateless button changes global counter onclick', () => {
  let counter = 0;

  const btn = button(
    {
      click_e: () => {
        counter += 1;
        update(btn);
      },
    },
    () => `Clicked ${counter} times!`,
  );

  expect(isUpdatable(btn)).toBe(true);

  const element = getElement(btn);

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
          update(btn);
        },
      },
      () => `Clicked ${counter} times!`,
    );

    return btn;
  };

  const element1 = getElement(CounterButton());
  const element2 = getElement(CounterButton());
  const element3 = getElement(CounterButton(333));

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
    (p({style: 'color:red'}, 'This text is red colored.') as Element).outerHTML,
  ).toBe('<p style="color: red;">This text is red colored.</p>');
});

test('init dynamic property', () => {
  let count = 0;

  expect(getElement(input({value: () => ++count})).value).toBe('1');
});

// 04.child

test('toggle button color', () => {
  let toggle = false;

  const tgl = button(
    {
      click_e: () => {
        toggle = !toggle;
        update(tgl);
      },
    },
    () => (toggle ? 'On' : 'Off'),
  );

  let counter = 0;

  const cnt = button(
    {
      click_e: () => {
        counter += 1;
        update(cnt);
      },
      style: () => (toggle ? 'color:green' : ''),
    },
    () => `Clicked ${counter} times!`,
  );

  const toggleElement = getElement(tgl);
  const counterElement = getElement(cnt);

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

  expect(getElement(app).innerHTML).toBe('2<p>1</p>'); // <p> init called first
  expect(getElement(app).childNodes.length).toBe(3);

  update(app);

  expect(getElement(app).innerHTML).toBe('4<p>3</p>'); // <p> re-created first
  expect(getElement(app).childNodes.length).toBe(3);
});

test('dynamic children array', () => {
  let dynamic: any = 'text';

  const app = div(() => dynamic, 'WWW');

  expect(getElement(app).innerHTML).toBe('textWWW');
  expect(getElement(app).childNodes.length).toBe(2);

  dynamic = [1, 2, 3];
  update(app);

  expect(getElement(app).innerHTML).toBe('123WWW');
  expect(getElement(app).childNodes.length).toBe(5);

  dynamic = ['a', 'b'];
  update(app);

  expect(getElement(app).innerHTML).toBe('abWWW');
  expect(getElement(app).childNodes.length).toBe(4);

  dynamic = 'one';
  update(app);

  expect(getElement(app).innerHTML).toBe('oneWWW');
  expect(getElement(app).childNodes.length).toBe(3); // +1 terminator

  let count = 0;

  dynamic = p(() => ++count);

  update(app);

  expect(getElement(app).innerHTML).toBe('<p>1</p>WWW');
  expect(getElement(app).childNodes.length).toBe(3);

  update(app);

  expect(getElement(app).innerHTML).toBe('<p>1</p>WWW');
  expect(getElement(app).childNodes.length).toBe(3);

  update(dynamic);

  expect(getElement(app).innerHTML).toBe('<p>2</p>WWW');
  expect(getElement(app).childNodes.length).toBe(3);

  count = 1;
  dynamic = [p(() => count), () => count];
  update(app);

  expect(getElement(app).innerHTML).toBe('<p>1</p>1WWW');
  expect(getElement(app).childNodes.length).toBe(4);

  count = 2;
  update(app);

  expect(getElement(app).innerHTML).toBe('<p>1</p>1WWW'); // same array, does not update
  expect(getElement(app).childNodes.length).toBe(4);
});

it('should update dynamic array components whith different arrays', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic: any[] = [paragraph];

  const app = div(() => dynamic);

  expect(getElement(app).innerHTML).toBe('<p>1</p>');

  dynamic = [paragraph]; // different array
  update(app);

  expect(getElement(app).innerHTML).toBe('<p>1</p>');

  update(paragraph);

  expect(getElement(app).innerHTML).toBe('<p>2</p>');

  dynamic = ['abc']; // different array
  update(app);

  expect(getElement(app).innerHTML).toBe('abc');
});

it('should not update dynamic array components with the same array', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic = [paragraph];

  const app = div(() => dynamic);

  expect(getElement(app).innerHTML).toBe('<p>1</p>');

  update(app); // same array

  expect(getElement(app).innerHTML).toBe('<p>1</p>');

  update(app); // same array

  expect(getElement(app).innerHTML).toBe('<p>1</p>');
});

it('should replace dynamic array with dynamic component and update component', () => {
  let count = 0;

  const paragraph = p(() => ++count);

  let dynamic: any = [paragraph];

  const app = div(() => dynamic);

  expect(getElement(app).innerHTML).toBe('<p>1</p>');

  dynamic = paragraph;

  update(app);

  expect(getElement(app).innerHTML).toBe('<p>1</p>');

  update(dynamic);

  expect(getElement(app).innerHTML).toBe('<p>2</p>');

  update(app);

  expect(getElement(app).innerHTML).toBe('<p>2</p>');
});

it('should not show boolean values', () => {
  expect((div(true) as Element).innerHTML).toBe('');
  expect((div(true || 'invisible') as Element).innerHTML).toBe('');
  expect(getElement(div(() => true)).innerHTML).toBe('');
  expect((div(false) as Element).innerHTML).toBe('');
  expect((div(false && 'invisible') as Element).innerHTML).toBe('');
  expect(getElement(div(() => false)).innerHTML).toBe('');
  expect((div([true, false]) as Element).innerHTML).toBe('');
  expect(getElement(div(() => [true, false])).innerHTML).toBe('');
  expect(getElement(div(() => [() => true, () => false])).innerHTML).toBe('');
});

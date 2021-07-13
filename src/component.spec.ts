import {component as h} from './component';

// afterEach(() => {
//   document.body.innerHTML = '';
// });

// test('Check addTodo able add todo to todoList', () => {
//   document.body.innerHTML = `
//     <input id="newTodoInput" />
//     <button id="addTodoBtn">Add todo</button>
//     <ol id="todoList"></ol>
//   `;

//   const addTodo = () => {
//     const newTodoInput = document.getElementById('newTodoInput') as HTMLInputElement;
//     let currentTodoList = document.getElementById('todoList')!.innerHTML;
//     currentTodoList += `<li>${newTodoInput.value}</li>`;
//     document.getElementById('todoList')!.innerHTML = currentTodoList;
//     newTodoInput.value = '';
//   }

//   document.getElementById('addTodoBtn')!.addEventListener('click', addTodo);

//   const newTodoInput = document.getElementById('newTodoInput') as HTMLInputElement;
//   const addTodoBtn = document.getElementById('addTodoBtn');
//   const todolist = document.getElementById('todoList');

//   newTodoInput.value = 'New todolist!';
//   addTodoBtn!.click();

//   expect(todolist!.innerHTML).toBe('<li>New todolist!</li>');
// });

// document.body.append(render());

// 01.singleton

test('stateless button changes global counter onclick', () => {
  let counter = 0;

  const render = h(
    'button',
    {onclick: () => {
      counter += 1;
      render();
    }},
    () => `Clicked ${counter} times!`
  );

  const buttonElement = render();

  expect(buttonElement.innerHTML).toBe('Clicked 0 times!');

  buttonElement.click();

  expect(buttonElement.innerHTML).toBe('Clicked 1 times!');

  buttonElement.click();
  buttonElement.click();

  expect(buttonElement.innerHTML).toBe('Clicked 3 times!');
});

// 02.multiple

test('stateful counter button instances are clicked', () => {
  const counterButton = (counter = 0) => {
    const render = h(
      'button',
      {onclick: () => {
        counter += 1;
        render();
      }},
      () => `Clicked ${counter} times!`
    );

    return render;
  };

  const buttonElement1 = counterButton()();
  const buttonElement2 = counterButton()();
  const buttonElement3 = counterButton(333)();

  expect(buttonElement1.innerHTML).toBe('Clicked 0 times!');
  expect(buttonElement2.innerHTML).toBe('Clicked 0 times!');
  expect(buttonElement3.innerHTML).toBe('Clicked 333 times!');

  buttonElement1.click();

  buttonElement2.click();
  buttonElement2.click();

  buttonElement3.click();
  buttonElement3.click();
  buttonElement3.click();

  expect(buttonElement1.innerHTML).toBe('Clicked 1 times!');
  expect(buttonElement2.innerHTML).toBe('Clicked 2 times!');
  expect(buttonElement3.innerHTML).toBe('Clicked 336 times!');
});

// 03.props

test('set color style of text', () => {
  expect(
    h('p', {style: 'color:red'}, 'This text is red colored.')().outerHTML
  ).toBe(
    '<p style="color:red">This text is red colored.</p>'
  );
});

// 04.child

test('', () => {
  let toggle = false;

  const toggleRender = h(
    'button',
    {onclick: () => {
      toggle = !toggle;
      toggleRender();
    }},
    () => toggle ? 'On' : 'Off',
  );

  const toggleElement = toggleRender();

  let counter = 0;

  const counterRender = h(
    'button',
    {
      onclick: () => {
        counter += 1;
        counterRender();
      },
      style: () => toggle ? 'color:green' : ''
    },
    () => `Clicked ${counter} times!`
  );

  const counterElement = counterRender();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe('<button style="">Clicked 0 times!</button>');

  counterElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('Off');
  expect(counterElement.outerHTML).toBe('<button style="">Clicked 2 times!</button>');

  toggleElement.click();

  counterElement.click();
  counterElement.click();
  counterElement.click();

  expect(toggleElement.innerHTML).toBe('On');
  expect(counterElement.outerHTML).toBe('<button style="color:green">Clicked 5 times!</button>');
});


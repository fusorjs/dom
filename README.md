# Fusor

Fusor is a simple Javascript library that helps declaratively create and update DOM elements.

> It fuses DOM elements.

## Example

```sh
npm install @fusorjs/dom
```

JSX is planned, this is a functional notation:

```js
import {button, div, p} from '@fusorjs/dom/html';

const CounterButton = ({count = 0}) => {
  // create button Component
  const btn = button(
    // props:
    {
      click$e: () => {
        count += 1;
        btn.update(); // update button text
      },
    },

    // children:
    'Clicked ',
    () => count, // dynamic value
    ' times.',
  );

  return btn;
};

document.body.append(
  div(
    p('Hello World!'), // static DOM Element

    // create dynamic components:
    CounterButton({}),
    CounterButton({count: 22}),
    CounterButton({count: 333}),
  ).element,
);
```

[Codesandbox Playground](https://codesandbox.io/s/fusor-intro-cvbhsk?file=/src/index.js)

Fusor will render these three buttons on a page:

```html
<div>
  <p>Hello World!</p>
  <button type="button">Clicked 0 times.</button>
  <button type="button">Clicked 22 times.</button>
  <button type="button">Clicked 333 times.</button>
</div>
```

And every time a button is clicked, Fusor will update its text accordingly.

## Why Fusor?

**Simple**

- It does two things and does it well.
- It helps to create and update DOM elements.
- So it is small, simple, and fast.
- It is explicit, without black box magic.

**Flexible**

- You control how you create and update your elements.
- Yet your code gets less verbose than with do-it-all frameworks.
- It is modular, extensible, configurable, and with sensible defaults.
- It is functional.

**Compatible**

- It is 100% compatible with web standards.
- So it could be integrated with anything.
- It is written in Typescript.

**Modern**

- It does not reinvent the wheel.
- It uses native/modern functionality.
- Such as custom elements for life-cycle events.

## Next Steps

For more details see the [DOCUMENTATION](DOCS.md).

For usage examples visit the [TUTORIAL](https://fusorjs.github.io/tutorial/) application.

Also, check out the [todo-list application](https://github.com/fusorjs/todomvc#readme) written with Fusor.

## Contribute

You are welcome to contribute to this project.

Please see [CHANGELOG](CHANGELOG.md) for details.

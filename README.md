# @fusorjs/dom

Fusor is a simple, functional Javascript library that declaratively creates and updates DOM nodes.

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
      onclick: () => {
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

This example will render three buttons on a page:

```html
<div>
  <p>Hello World!</p>
  <button type="button">Clicked 0 times.</button>
  <button type="button">Clicked 22 times.</button>
  <button type="button">Clicked 333 times.</button>
</div>
```

## Component

A `Component` object holds a DOM Element and manages its dynamic values.

It has two properties:

- `element`: get the associated DOM Element object
- `update`: propagate dynamic values to the `element` (make changes visible), return `this`.

## Creators

This imported functions are creators:

```js
import {button, div, p} from '@fusorjs/dom/html';
```

A creator initializes a respective DOM Element and returns, depending on the presence of **dynamic** values, either:

- this **static** DOM Element
- new **dynamic** `Component` object

> SVG creators in `@fusorjs/dom/svg`.

## Static vs Dynamic

**Dynamic children** are:

- functions, like: `() => count`
- `Component` objects

**Dynamic props** are functions, like: `{class: () => editing ? 'editing' : ''}`.

> Prop names that begin with `on...` are **static** event handlers, like: `{onclick: () => {}}`.

Everything else is **static**.

## Why Fusor?

- You already know Fusor, if you have read this far.
- It does one thing and does it well.
- You control your updation strategy.
- It uses functional approach.
- Fusor and Web Components are great together.

Fusor is:

- **Simple**: small, explicit, and predictable with sensible defaults.
- **Flexible**: functional, modular, extensible, configurable, integratable.
- **Compliant**: 100% compatible with web standards.
- **Performant**: tiny and fast.

## Fusor vs React

|                      | Fusor        | React                                           |
| -------------------- | ------------ | ----------------------------------------------- |
| Objects in Component | Created once | Re-created on each update even with memoization |
| State, effects, refs | Simple       | Verbose and complex Hooks subsystem             |
| Updating components  | Explicit     | Complex, diffing, lifecycle, concurrent, ...    |
| DOM                  | Real         | Virtual                                         |
| Events               | Native       | Synthetic                                       |
| Life-cycle           | Native       | Diffing???                                      |

## Next Steps

For more details see the [DOCUMENTATION](DOCS.md).

Check out the [complete todo-list application](https://github.com/fusorjs/todomvc#readme) written with Fusor.

## Contribute

You are welcome to contribute to this project.

Please see [CHANGELOG](CHANGELOG.md) for details.

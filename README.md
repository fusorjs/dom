# @fusorjs/dom

Fusor declaratively manages DOM.

Fusor is a simple, flexible, standard-compliant, and performant library.

> It fuses DOM Elements.

## Example

```sh
npm install @fusorjs/dom
```

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

> It is a functional notation, JSX support is planned.

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

## Initializers

This imported functions are initializers:

```js
import {button, div, p} from '@fusorjs/dom/html';
```

An initializer creates a respective DOM Element and returns, depending on the presence of **dynamic** values, either:

- this **static** DOM Element
- new **dynamic** `Component` object

> SVG initializers in `@fusorjs/dom/svg`.

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

Fusor is:

- **Simple**: small, explicit, and predictable with sensible defaults.
- **Flexible**: functional, modular, extensible, configurable, and integrates easily.
- **Compliant**: 100% compatible with web standards.
- **Performant**: tiny and fast.

## Fusor vs React

|                      | Fusor        | React                                           |
| -------------------- | ------------ | ----------------------------------------------- |
| Objects in Component | Created once | Re-created on each update even with memoization |
| State, effects, refs | Simple       | Verbose and complex Hooks subsystem             |
| Updating components  | Explicit     | Complex, diffing, lifecycle, concurrent, ...    |
| Events               | Native       | Synthetic                                       |
| DOM                  | Real         | Virtual                                         |

## Next Steps

For more details see the [DETAILS](DOCS.md).

Check out the [complete todo-list application](https://github.com/fusorjs/todomvc#readme) written with Fusor.

## Contribute

You are welcome to contribute to this project.

Please see [CHANGELOG](CHANGELOG.md) for details.

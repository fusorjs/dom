# Fusor

Fusor is a simple JavaScript library that helps to declaratively create and update DOM elements.

> It _fuses_ DOM elements into easy-to-use _components_.

Fusor is:

- **Simple** ― two main API methods (create/update DOM)
- **Compliant** ― follows W3C standards
- **Explicit/Flexible** ― full control over DOM creation/updates, state, context, lifecycle, diffing, and concurrency
- **Performant** ― efficient use of data and code
- **Small** ― size ~4KiB with zero dependencies

> "_Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away._" ― Antoine de Saint-Exupéry

## Component Examples

All examples are available on [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

`click_e_update` ― click event handler with DOM update, see: [Parameter Keys Reference](docs/reference.md#parameter-keys)

### Click Counting Button

```jsx
const CountingButton = ({count = 0}) => (
  <button click_e_update={() => count++}>Clicked {() => count} times</button>
);
```

### Controlled Uppercase Input

```jsx
const UppercaseInput = ({value = ''}) => (
  <input
    value={() => value}
    input_e_update={(event) => (value = event.target.value.toUpperCase())}
  />
);
```

### Mounting Timer

```jsx
const IntervalCounter = ({count = 0}) => (
  <div
    mount={(self) => {
      const timerId = setInterval(() => {
        count++;
        update(self);
      }, 1000);

      return () => clearInterval(timerId); // unmount
    }}
  >
    Since mounted {() => count} seconds elapsed
  </div>
);
```

Also, check out [SVG Analog Clock](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx).

## Documentation

- [**Tutorial**](docs/tutorial.md)
- [Reference](docs/reference.md)
- [Functional Notation](docs/functional-notation.md)
- [Optimisation](docs/optimisation.md)
- [Fusor vs React](docs/fusor-vs-react.md)

## Real-World Applications

- [TodoMvc](https://github.com/fusorjs/todomvc) - routing, global data store
- [Tutorial](https://github.com/fusorjs/tutorial) - routing, http request, lifecycle, custom element, caching, jsx, svg, mathml, xml

## Start Coding

Start with a boilerplate project:

- [**JavaScript Starter**](https://github.com/fusorjs/dom-starter-jsx-webpack)
- [**TypeScript Starter**](https://github.com/fusorjs/dom-starter-tsx-webpack)

Or configure it [manually](docs/reference.md#install)

## Contribute

Your contributions are always welcome!

See [CHANGELOG](CHANGELOG.md) for details.

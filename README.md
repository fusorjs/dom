# Fusor

Fusor is a simple JavaScript library that helps to declaratively create and update DOM elements.

It combines DOM elements into _components_ that can be used to build real-world web applications, just like in React, Angular, or Vue. But it's simpler and more efficient.

Fusor is:

- **Simple** ― just **two** main API methods: `create` and `update` (the DOM)
- **Compliant** ― follows W3C standards
- **Explicit/Flexible** ― full control over DOM creation/updates, state, context, lifecycle, diffing, and concurrency
- **Performant** ― efficient use of data and code
- **Small** ― [size ~3kB](https://bundlephobia.com/package/@fusorjs/dom@2.5.1) with zero dependencies

Fusor's philosophy:

> "_Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away._" ― Antoine de Saint-Exupéry

## Component Examples

All examples are available on [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

### Click Counting Button

```jsx
const CountingButton = ({count = 0}) => (
  <button click_e_update={() => count++}>Clicked {() => count} times</button>
);
```

Some of the [Parameter Options](docs/reference.md#parameter-keys):

```jsx
<div
  name1="automatic attribute or property"
  name2_a="attribute"
  name3_p="property"
  name4_e={(event) => 'handler'}
  name5_e_capture_once={(event) => 'handler with options'}
/>
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

<!-- ### Routing

```tsx
import {getRoute, Route, mountRoute} from '../share/route';
export const RouteLink = (title: string, route: Route) =>
  a(
    {
      href: `#${route}`,
      class: () => clsx(getRoute() === route && 'selected'),
      mount: mountRoute,
    },
    title,
  );
``` -->

Also, check out [SVG Analog Clock](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx).

## Documentation

- [**>> TUTORIAL <<**](docs/tutorial.md)
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

## Contributing

Your suggestions and contributions are always welcome!

Please see [CONTRIBUTING](CONTRIBUTING.md) for details and [CHANGELOG](CHANGELOG.md) for agenda.

# Fusor

## Intro

**Fusor is a simple JavaScript library that helps to declaratively create and update DOM elements.**

<!-- > It fuses (DOM) elements together -->

These DOM elements can then be composed into functional components that are used to build real-world web applications, just like in React, Angular, or Vue, but in a simpler and more efficient way.

### Benefits

- **Simple** ― two main API methods
- **Compliant** ― follows W3C standards
- **Explicit/Flexible/Performant** ― full control over: DOM creation/updates, state, context, diffing, concurrency
- **Small** ― size [~3kB](https://bundlephobia.com/package/@fusorjs/dom@2.5.1), no dependencies

## Examples

[**>> Try them on CodeSandbox <<**](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

### Click Counting Component

```jsx
const CountingButton = ({count = 0}) => (
  <button click_e_update={() => count++}>Clicked {() => count} times</button>
);
```

### DOM Parameter Options

```jsx
<div
  name1="automatic attribute or property"
  name2_a="attribute"
  name3_p="property"
  name4_e={(event) => 'handler'}
  name5_e_capture_once={(event) => 'handler with options'}
  click_e_update={(event) => {}}
  // equivalent to
  click_e={(event, self) => update(self)}
/>
```

[Options' Reference](docs/reference.md#parameter-keys):

### Controlled Uppercase Component

```jsx
const UppercaseInput = ({value = ''}) => (
  <input
    value={() => value}
    input_e_update={(event) => (value = event.target.value.toUpperCase())}
  />
);
```

### Mounting Timer Component

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

[**Check SVG Analog Clock**](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx).

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

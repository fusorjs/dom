# Fusor

<!-- > It fuses elements into components -->

## Intro

**Fusor is a simple JavaScript library that helps to declaratively create and update DOM elements.**

These DOM elements can then be composed into functional components that are used to build real-world web applications.

It is similar to **React** but operates at a lower level of abstraction. However, it is much simpler, efficient and less verbose.

### Benefits

- **Simple** ― two main API methods
- **Compliant** ― follows W3C standards
- **Explicit/Flexible/Performant** ― full control over: DOM creation/updates, state, context, diffing, concurrency
- **Small** ― size [~3kB](https://bundlephobia.com/package/@fusorjs/dom@2.5.2), no dependencies

## Examples

[**>> TRY THEM LIVE <<**](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

### Reusable Component

#### JSX Syntax

```jsx
import {getElement} from '@fusorjs/dom';

// This function runs once on creation, generating a DOM element
// and its updater function. On update, only its dynamic values
// are diffed and its DOM node is updated.
const ClickCounter = ({count = 0}) => (
  <button click_e_update={() => count++}>Clicked {() => count} times</button>
);

const App = () => (
  <div>
    <ClickCounter />
    <ClickCounter count={22} />
    <ClickCounter count={333} />
  </div>
);

document.body.append(getElement(<App />));
```

#### Alternative Functional Syntax

```js
import {button} from '@fusorjs/dom/html';

const ClickCounter = ({count = 0}) =>
  button({click_e_update: () => count++}, 'Clicked ', () => count, ' times');
```

### Cheat Sheet

<!-- prettier-ignore -->
```jsx
const cheatSheet = (
  <div
    name="set attribute or property automatically"
    name_a="set attribute"
    name_p="set property"
    name_e={() => 'set bubbling event handler'}
    name_e_capture_once={() => 'set capturing event handler once'}

    // update dynamic values in this DOM node
    click_e_update={() => count++} // same as
    click_e={() => {count++; update(cheatSheet);}} // same as
    click_e={(event, self) => {count++; update(self);}}

    // dynamic attribute or property is wrapped in a function
    class={() => (count % 2 ? 'odd' : 'even')}
  >
    Dynamic child {() => count} is wrapped in a function.
    Static child {count} never changes.
  </div>
);
```

<!-- [Options' Reference](docs/reference.md#parameter-keys): -->

<!-- ### Controlled Uppercase Component

```jsx
const UppercaseInput = ({value = ''}) => (
  <input
    value={() => value}
    input_e_update={(event) => (value = event.target.value.toUpperCase())}
  />
);
``` -->

### Component Lifecycle

```jsx
import {getElement, update} from '@fusorjs/dom';

const IntervalCounter = ({count = 0}) => (
  <div
    // 2. Connect to DOM
    mount={(self) => {
      const timerId = setInterval(() => {
        count++;
        update(self); // 3. Update DOM
      }, 1000);

      return () => clearInterval(timerId); // 4. Disconnect from DOM
    }}
  >
    Since mounted {() => count} seconds elapsed
  </div>
);

document.body.append(getElement(<IntervalCounter />)); // 1. Create component
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
- [Functional Syntax](docs/functional-notation.md)
- [Optimization](docs/optimisation.md)
- [Fusor vs React](docs/fusor-vs-react.md)
- [Fusor vs React Verbosity](docs/fusor-vs-react-verbosity.md)

## Real-World Applications

- [TodoMvc](https://github.com/fusorjs/todomvc) - routing, global data store
- [Tutorial](https://github.com/fusorjs/tutorial) - nested routing, http request, lifecycle, custom element, caching, jsx, svg, mathml, xml

## Start Coding

Start with a boilerplate project:

- [**JavaScript Starter**](https://github.com/fusorjs/dom-starter-jsx-webpack)
- [**TypeScript Starter**](https://github.com/fusorjs/dom-starter-tsx-webpack)

Or configure it [manually](docs/reference.md#install)

## Contributing

Your suggestions and contributions are always welcome!

Please see [CONTRIBUTING](CONTRIBUTING.md) for details and [CHANGELOG](CHANGELOG.md) for agenda.

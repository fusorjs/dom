# Fusor

## Declaratively Creates & Updates DOM

> It _fuses_ DOM elements into easy-to-use components

## Goals

- **Simplicity**
  - Small, explicit, **pure**, **functional** API
- **Flexibility**
  - W3C standards **compliant**
  - _Simple things should be simple, complex things should be possible_
    - **Fine-grained control** over creation and updates
- **Minimalism**
  - _Do one thing and do it well_
    - **Lifting up**: state, context, lifecycle, diffing, concurrency
- **Performance**
  - Efficient use of provided and internal data
    - **Immutability**, avoid excessive creation
  - Size **~4KiB** with **zero** dependencies

## Examples

### Create a DOM Element

```jsx
import {getElement} from '@fusorjs/dom';

const count = 0;
const message = <div>Seconds {count} elapsed</div>; // JSX

document.body.append(getElement(message));
```

> [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

### Update a DOM Element

```jsx
import {getElement, update} from '@fusorjs/dom';

let count = 0;
const message = <div>Seconds {() => count} elapsed</div>; // JSX

document.body.append(getElement(message));

setInterval(() => {
  count += 1;
  update(message);
}, 1000);
```

> [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

### Create a Reusable Component

> `click_e` - click event handler - [keys reference](docs/reference.md#event-handler-keys)

```jsx
import {getElement, update} from '@fusorjs/dom';

const CountingButton = ({count = 0}) => {
  const self = (
    <button
      click_e={() => {
        // click event handler
        count += 1;
        update(self);
      }}
    >
      Clicked {() => count} times
    </button>
  );
  return self;
};

const App = () => (
  <div style="padding:1em">
    <p>Three counting buttons</p>
    <CountingButton />
    <CountingButton count={22} />
    <CountingButton count={333} />
  </div>
);

document.body.append(getElement(App()));
```

> [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

#### Shorter Version

```jsx
const CountingButton = ({count = 0}) => (
  <button
    click_e={(event, self) => {
      count += 1;
      update(self);
    }}
  >
    Clicked {() => count} times
  </button>
);
```

> [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

#### Shortest Version

> `click_e_update` - click event handler and DOM update - [keys reference](docs/reference.md#event-handler-keys)

```jsx
const CountingButton = ({count = 0}) => (
  <button click_e_update={() => (count += 1)}>
    Clicked {() => count} times
  </button>
);
```

> [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

## Lifecycle

It consists of only four stages:

1. **Create** the component
2. **Connect** to the DOM
3. **Update** the DOM
4. **Disconnect** from the DOM

```jsx
import {getElement, update} from '@fusorjs/dom';

const IntervalCounter = ({count = 0}) => {
  console.log('1. Create the component');

  return (
    <div
      mount={(self) => {
        console.log('2. Connect to the DOM');

        const timerId = setInterval(() => {
          count++;
          update(self);
          console.log('3. Update the DOM');
        }, 1000);

        return () => {
          clearInterval(timerId);
          console.log('4. Disconnect from the DOM');
        };
      }}
    >
      Since mounted {() => count} seconds elapsed
    </div>
  );
};

const instance = <IntervalCounter />;
const element = getElement(instance);

document.body.append(element);
setTimeout(() => element.remove(), 15000);
```

> [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)
>
> [SVG Analog Clock](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx)

## This concludes the Tutorial

Now you know how to develop useful applications. In fact, this knowledge enables you to create apps on par with those developed using **React, Angular, Vue, Solid**...

> [Fusor vs React comparison](docs/fusor-vs-react.md)

## Start Coding

Start with a boilerplate project:

- [**JavaScript Starter**](https://github.com/fusorjs/dom-starter-jsx-webpack)
- [**TypeScript Starter**](https://github.com/fusorjs/dom-starter-tsx-webpack)

Or configure it [manually](docs/reference.md#install)

## Documentation

- [Reference](docs/reference.md)
- [Functional Notation](docs/functional-notation.md)
- [Optimisation](docs/optimisation.md)
- [Fusor vs React](docs/fusor-vs-react.md)

## Real-World Applications

- [TodoMvc](https://github.com/fusorjs/todomvc) - routing, global data store
- [Tutorial](https://github.com/fusorjs/tutorial) - routing, http request, lifecycle, svg, jsx, custom element, caching

## Contribute

Your contributions are always welcome!

See [CHANGELOG](CHANGELOG.md) for details.

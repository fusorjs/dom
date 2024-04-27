# Fusor

Fusor is a simple JavaScript library that declaratively creates and updates DOM elements

> It **fuses** elements

## Goals

- **Performance**
- **Simple**, explicit and flexible API
- Compatible and integrable with other tools
- Do one thing and do it well (manage DOM elements)
- Simple things should be simple, complex things should be possible (Alan Kay)
- **Fine-grained control** over:
  - DOM updates
  - Diffing strategy
  - State management
- Lightweight (**~3kB** and **zero** dependencies)

## FN Example

- Functional-notation button counter (hyper-notation also available)
- **No transpilation needed**

[Playground](https://codesandbox.io/p/sandbox/fusor-intro-cvbhsk?file=%2Fsrc%2Findex.js%3A8%2C23)

```js
import {button, div, p} from '@fusorjs/dom/html';

const CountingButton = (count = 0) => {
  const component = button(
    {
      click$e: () => {
        count += 1;
        component.update();
      },
    },
    'Clicked ',
    () => count,
    ' times',
  );
  return component;
};

const App = () =>
  div(
    p('Hello Fusor'),
    CountingButton(),
    CountingButton(22),
    CountingButton(333),
  );

document.body.append(App().element);
```

The `click$e` means:

- `click` name
- `e`vent handler
- `$` separator symbol (configurable)

See the [complete key reference](docs/reference.md#keys)

## JSX Example

- Same counter button implemented with JSX
- Adds the option to `update` the component after the click event

[Playground](https://codesandbox.io/p/sandbox/fusor-intro-jsx-r96fgd?file=%2Fsrc%2Findex.tsx)

```jsx
const CountingButton = ({init: count = 0}) => (
  <button click$e$update={() => (count += 1)}>
    Clicked {() => count} times
  </button>
);

const App = () => (
  <div>
    <p>Hello Fusor</p>
    <CountingButton />
    <CountingButton init={22} />
    <CountingButton init={333} />
  </div>
);

document.body.append(App().element);
```

## Documentation

- [**START WITH TUTORIAL**](docs/tutorial.md)
- [Reference](docs/reference.md)
- [Functional Notation](docs/functional-notation.md)
- [Optimisation](docs/optimisation.md)
- [Fusor vs React](docs/fusor-vs-react.md)

## Demo

- [Tutorial](https://fusorjs.github.io/tutorial/) - routing, request, lifecycle, SVG, JSX...
- [Todo-list](https://github.com/fusorjs/todomvc#readme)
- [SVG analog clock](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx)

## Contribute

Contributions are welcome

See [CHANGELOG](CHANGELOG.md) for details

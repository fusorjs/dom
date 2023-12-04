# Fusor

Fusor is a simple JavaScript library that declaratively manages DOM

> It **fuses** elements

## Example

[Playground](https://codesandbox.io/s/fusor-intro-jsx-r96fgd?file=/src/index.tsx)

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

The `click$e$update` means:

- `click`
- `e`vent handler
- `update` DOM when handler completes
- `$` separator symbol
- [full reference](docs/reference.md#keys)

## Fusor vs React

Check [Fusor vs React](docs/fusor-vs-react.md) comparison

## Why Fusor

- It is simple, lightweight, explicit, flexible and compatible
- It extensively utilizes modern JavaScript and browser features
- It follows the principle of doing one thing and doing it well (managing DOM elements)
- It has **zero** dependencies and is only around **2kB** in size

## Documentation

- [TUTORIAL](docs/tutorial.md)
- [Fusor vs React](docs/fusor-vs-react.md)
- [Reference](docs/reference.md)
- [Functional Notation](docs/functional-notation.md)
- [Optimisation](docs/optimisation.md)

## Applications

- [Tutorial](https://fusorjs.github.io/tutorial/) - routing, request, lifecycle, SVG, JSX...
- [Todo-list](https://github.com/fusorjs/todomvc#readme)
- [SVG analog clock](https://codesandbox.io/s/fusor-analog-clock-jsx-hqs5x9?file=/src/index.tsx)

## Contribute

Your contributions are welcome

See [CHANGELOG](CHANGELOG.md) for details

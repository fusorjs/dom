# Fusor

Fusor is a simple JavaScript library that helps declaratively create and update DOM elements.

> It **fuses** DOM elements together.

## Example

### Create DOM

```jsx
document.body.append(<div>The ultimate answer is {42}</div>); // JSX
```

### Update DOM

```jsx
let count = 0;
const answer = <div>Seconds {() => count} elapsed</div>;

document.body.append(answer.element);

setInterval(() => {
  count += 1;
  answer.update();
}, 1000);
```

### Reusable Component

> `click_e` - means click event handler - [view all W3C standards-compliant options](docs/reference.md#keys)

```jsx
const CountingButton = ({count = 0}) => {
  const btn = (
    <button
      click_e={() => {
        // click event handler
        count += 1;
        btn.update();
      }}
    >
      Clicked {() => count} times
    </button>
  );
  return btn;
};

const App = () => (
  <div>
    <p>Three click-counting buttons</p>
    <CountingButton />
    <CountingButton count={22} />
    <CountingButton count={333} />
  </div>
);

document.body.append(App().element);
```

<!-- const CountingButton = ({init: count = 0}) => (
  // click_e_update: click event handler, update DOM after a call
  <button click_e_update={() => (count += 1)}>
    Clicked {() => count} times
  </button>
); -->

> [**Playground**](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx)

<!-- > `click_e_update` means: `click` `e`vent handler `update`s DOM after the call [...reference.](docs/reference.md#keys)

Property key `click_e_update` means:

- `click` name
- `e`vent handler
- `update` DOM after the event
- `_` configurable separator symbol
- [keys reference](docs/reference.md#keys) -->

## Not a React clone

While Fusor shares some concepts with React, it distinguishes itself by adopting a more flexible and minimalist approach. Essentially, the complexity of hooks, lifecycle, and concurrency is replaced by fine-grained DOM update control.

> [Fusor vs React comparison](docs/fusor-vs-react.md)

## Goals

### Simplicity + Minimalism + Flexibility + Performance

- Small, **simple**, explicit and flexible API.
- Standards compliant and integrable with other tools.
- Do one thing and do it well (manage DOM elements), **outsource**: state, lifecycle, context, diffing, etc.
- Simple things should be simple, complex things should be possible (Alan Kay). **Fine-grained control** over DOM updates.
- Efficient CPU and memory usage by reusing given objects and arrays without their recreation nor modification. Avoid arrays flattening, object's `rest`ing or `spread`ing operations.
- Lightweight (**~4KiB** with **zero** dependencies).

## Documentation

- [**START WITH TUTORIAL**](docs/tutorial.md)
- [Reference](docs/reference.md)
- [Functional Notation](docs/functional-notation.md)
- [Optimisation](docs/optimisation.md)
- [Fusor vs React](docs/fusor-vs-react.md)

## Demos

- [Use cases](https://fusorjs.github.io/tutorial/) (routing, request, lifecycle, SVG, JSX...)
- [Todo-list](https://github.com/fusorjs/todomvc#readme)
- [SVG analog clock](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx)
- [FN counting button](https://codesandbox.io/p/sandbox/fusor-intro-cvbhsk?file=%2Fsrc%2Findex.js%3A8%2C23)
- [JSX counting button](https://codesandbox.io/p/sandbox/fusor-intro-jsx-r96fgd?file=%2Fsrc%2Findex.tsx)

## Contribute

Your contributions are welcome!

See [CHANGELOG](CHANGELOG.md) for details.

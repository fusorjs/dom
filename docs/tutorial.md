# Fusor Tutorial

## Install

```sh
npm install @fusorjs/dom
```

## Configure

Fusor supports different styles of defining components:

| Notation   | Sample                    | Description          |
| ---------- | ------------------------- | -------------------- |
| JSX        | `<div>Hello world</div>`  | Transpilation needed |
| Functional | `div('Hello world')`      | The most flexible    |
| Hyper      | `h('div', 'Hello world')` | The most flexible    |

You can use all of them interchangeably. [Functional/Hyper Notation](functional-notation.md) is simpler to set up, does not require transpilation and available in JSX automatically.

### Starter Project Examples

- **JSX**
  - JavaScript - Webpack - [Github](https://github.com/fusorjs/starter-dom-jsx-source-webpack) - [Codesandbox](https://codesandbox.io/p/sandbox/fusor-intro-jsx-webpack-4m7r37?file=%2Fsrc%2Fapp.jsx)
  - TypeScript - Parcel - [Codesandbox](https://codesandbox.io/p/sandbox/fusor-intro-tsx-r96fgd?file=%2Fsrc%2Findex.tsx)
- **Functional Notation**
  - JavaScript - Parcel - [Codesandbox](https://codesandbox.io/p/sandbox/fusor-intro-cvbhsk?file=%2Fsrc%2Findex.js%3A8%2C23)
  - TypeScript - Parcel - [Codesandbox](https://codesandbox.io/p/sandbox/fusor-intro-ts-h3wlp5?file=%2Fsrc%2Findex.ts)

## Creating static DOM nodes

```jsx
const value = 0;

const htmlDivElement = (
  <div>
    <p>Static {value} content</p>
  </div>
);

document.body.append(htmlDivElement);
```

<!-- const htmlDivElement2 = div(p('Static ', value, ' content')); -->

## Updating a dynamic DOM node

```jsx
let value = 0;

const fusorComponent = (
  <div>
    <p>Dynamic {() => value} content</p>
  </div>
);

document.body.append(fusorComponent.element);

setInterval(() => {
  value += 1;
  fusorComponent.update();
}, 1000);
```

## What is a Fusor component?

```js
class Component {
  element; // DOM Element of this Component
  update(); // Update dynamic attributes and children recursively
}
```

## Static vs Dynamic

### What makes a static DOM node?

```jsx
const htmlDivElement1 = <div>Children that are not functions</div>;

const htmlDivElement2 = (
  <div>
    Children made of other <b>static</b> DOM elements {htmlDivElement1}
  </div>
);

const htmlDivElement3 = (
  <div class="name">Attributes or properties that are not functions</div>
);

const htmlDivElement4 = <div click_e={(event) => 'Event handlers'} />;
```

### What makes a dynamic Fusor component?

```jsx
const fusorComponent1 = <div>{() => count} child is a function </div>;

const fusorComponent2 = <div>{fusorComponent1} child is a component</div>;

const fusorComponent3 = (
  <div class={() => name}>attribute or property is a function</div>
);
```

## Keys: attributes, properties, events

```jsx
<div
  name1="automatic, attribute or property"
  name2_a="attribute"
  name3_p="property"
  name4_e={() => 'handle event'}
/>
```

See full [reference](reference.md#keys) on keys

## Making reusable components

Create your components by encapsulating Fusor components with state and properties inside functions.

[Playground](https://codesandbox.io/s/fusor-intro-jsx-r96fgd?file=/src/index.tsx)

```jsx
const CountingButton = (props) => {
  let state = props.init || 0;

  const component = (
    <button
      click_e={() => {
        state += 1;
        component.update();
      }}
    >
      Clicked {() => state} times
    </button>
  );

  return component;
};

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

The `CountingButton` component could be shortened to:

```jsx
const CountingButton = ({init: state = 0}) => (
  <button click_e_update={() => (state += 1)}>
    Clicked {() => state} times
  </button>
);
```

## JSX rules

- Fusor component names (HTML/SVG) start with lowercase letters
- Your component names must be Capitalized
- Your components can take a single `props` object argument

## Component lifecycle

1. Initialization/Creation of component
2. Mount to DOM
3. Update DOM
4. Unmount from DOM

```jsx
const CounterComponent = ({count = 0}) => (
  <div
    // 2. Mount
    mount={(self) => {
      const timerId = setInterval(() => {
        count++;
        self.update(); // 3. Update
      }, 1000);

      // 4. Unmount
      return () => clearInterval(timerId);
    }}
  >
    Since mounted {() => count} seconds elapsed
  </div>
);

// 1. Initialization/Creation
const component = CounterComponent();

document.body.append(component.element);
```

> SVG elements cannot have a lifecycle yet, but there is a proposal

[Lifecycle example](https://fusorjs.github.io/tutorial/#Jsx)

[SVG analog clock](https://codesandbox.io/s/fusor-analog-clock-jsx-hqs5x9?file=/src/index.tsx)

## Next

This is all you need to start developing with Fusor.

For more detailed information read:

- [Reference](reference.md)
- [Functional Notation](functional-notation.md)
- [Optimisation](optimisation.md)
- [Fusor vs React](fusor-vs-react.md)

Also check these demo applications:

- [Tutorial](https://fusorjs.github.io/tutorial/) - routing, request, lifecycle, SVG, JSX...
- [Todo-list](https://github.com/fusorjs/todomvc#readme)
- [SVG analog clock](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx)

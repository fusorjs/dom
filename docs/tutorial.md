# Fusor Tutorial

## Install

```sh
npm install @fusorjs/dom
```

## Configure

If you are going to use JSX, you will need a build tool. For example, TypeScript will suffice

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "jsx"
  }
}
```

[JSX Playground](https://codesandbox.io/s/fusor-intro-jsx-r96fgd?file=/src/index.tsx)

---

However, you can completely go without JSX or any build tools by using [functional notation](functional-notation.md) that is interchangeable with JSX

[FN Playground](https://codesandbox.io/s/fusor-intro-cvbhsk?file=/src/index.js)

## Creating DOM

```jsx
let value = 0;

const htmlDivElement = (
  <div>
    <p>Static {value} content</p>
  </div>
);

document.body.append(htmlDivElement);
```

## Updating DOM

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

## Fusor component

```js
class Component {
  // Return DOM Element of this Component
  get element();

  // Update the Element's attributes and children recursively
  update();
}
```

## Static vs dynamic

### What makes a static DOM tree

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

const htmlDivElement4 = <div click$e={(event) => 'Event handlers'} />;
```

### What makes a dynamic Fusor component

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
  name="set property or attribute automatically"
  name$a="set attribute"
  name$p="set property"
  name$e={() => 'set event handler'}
/>
```

See full [reference](reference.md#keys) on keys

## Making reusable components

Create components by encapsulating Fusor components with properties and state in functions

[Playground](https://codesandbox.io/s/fusor-intro-jsx-r96fgd?file=/src/index.tsx)

```jsx
const CountingButton = (props) => {
  let state = props.init || 0;

  const component = (
    <button
      click$e={() => {
        state += 1;
        component.update();
      }}
    >
      Clicked {() => state} times
    </button>
  );

  return component;
};
```

The above could be shortened to:

```jsx
const CountingButton = ({init: count = 0}) => (
  <button click$e$update={() => (count += 1)}>
    Clicked {() => count} times
  </button>
);
```

## Component rules

- Fusor component names (HTML/SVG) start with lowercase letters
- Your component names must be capitalized
- Your components can take a single `props` object argument

## Component lifecycle

1. Initialization of component
2. Mount to DOM
3. Update DOM
4. Unmount from DOM

```jsx
const CounterComponent = (count = 0) => (
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

// 1. Initialization
const component = CounterComponent();

document.body.append(component.element);
```

[Lifecycle example](https://fusorjs.github.io/tutorial/#Jsx)

[SVG analog clock](https://codesandbox.io/s/fusor-analog-clock-jsx-hqs5x9?file=/src/index.tsx)

## Next

- [Tutorial App](https://fusorjs.github.io/tutorial/) - routing, request, lifecycle, SVG, JSX...
- [Reference](reference.md)
- [Fusor vs React](fusor-vs-react.md)
- [Functional Notation](functional-notation.md)
- [Optimisation](optimisation.md)

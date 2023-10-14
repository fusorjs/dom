# Fusor Tutorial

## Install

```sh
npm install @fusorjs/dom
```

## Configure

If you're going to use JSX, you will need a build tool, such as TypeScript

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "jsx"
  }
}
```

[Full JSX example](https://codesandbox.io/s/fusor-intro-jsx-r96fgd?file=/src/index.tsx)

---

However, you can completely do without JSX or any build tools by using a more robust [functional notation](REFERENCE.md#functional-notation) that is fully interchangeable with JSX

[Full functional notation example](https://codesandbox.io/s/fusor-intro-cvbhsk?file=/src/index.js)

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

```ts
class Component {
  // Never changes
  private domElement: Element;

  // Return domElement
  get element(): Element;

  // Update the attributes and children of the domElement, return this
  update(): Component;
}
```

## Static vs dynamic

### What makes a static DOM tree

```jsx
const htmlDivElement1 = <div>Children that are not functions</div>;

const htmlDivElement2 = (
  <div>
    Children that are other <b>static</b> DOM elements {htmlDivElement1}
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

## DOM attributes, properties, events

```jsx
<div
  name="set property or attribute automatically"
  name$a="set attribute"
  name$p="set property"
  name$e={() => 'set event handler'}
/>
```

For edge cases, please refer to the full [reference](REFERENCE.md#property-and-attribute-values)

## Making reusable components

Create components by encapsulating Fusor components with properties and state inside functions

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

[Play with CountingButton example](https://codesandbox.io/s/fusor-intro-jsx-r96fgd?file=/src/index.tsx)

Follow this rules:

- Fusor component (HTML/SVG/custom-element tag) names start with lowercase letters
- Your component names must be capitalized
- Your components can take a single `props` object argument

## Component lifecycle

To help catch lifecycle events, Fusor has a `fusor-life` [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks)

```jsx
import {jsx} from '@fusorjs/dom';
import '@fusorjs/dom/life'; // register fusor-life

let count = 0;
let timerId: NodeJS.Timer | undefined;

const fusorComponent = (
  <fusor-life
    // mount
    connected$e={() => {
      timerId = setInterval(() => {
        count++;
        fusorComponent.update();
      }, 1000);
    }}
    // unmount
    disconnected$e={() => {
      clearInterval(timerId);
    }}
  >
    Since mounted {() => count} seconds elapsed
  </fusor-life>
);

document.body.append(fusorComponent.element);
```

[See the example](https://fusorjs.github.io/tutorial/#Jsx)

[Play with analog clock example](https://codesandbox.io/s/fusor-analog-clock-jsx-hqs5x9?file=/src/index.tsx)

## Next

For more in-depth information, please refer to this [REFERENCE](REFERENCE.md)

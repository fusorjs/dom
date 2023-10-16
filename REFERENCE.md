# Fusor Reference

This document contains mixed examples of both JSX and function notation, although they are interchangeable

## DOM children values

- Values such as `true, false, null, undefined` are treated as empty strings `""` to enable logical expressions `isVisible && <ModalDialog />`
- Static arrays are treated as if they were flattened in children
- Dynamic arrays will replace their associated children (**TODO** currently, they replace all children)
- Everything else is converted into a text node

## DOM property and attribute values

- Property values are applied as-is
- An attribute is removed if its value is one of the following: `"", null, false, undefined`
- An attribute is set to `""` if its value is `true`
- An attribute is set, with anything else being converted to a string

## DOM attributes, properties, events

### Set property or attribute automatically

Do not use `$` suffix:

- Set a property if value is of reference type: `Object`, `Array`, `Function`... (not `null`)
- Set a property if it is already exists on the element
- Set an attribute otherwise

### Enforce the type

Use `$` suffix:

- `a` - `a`ttribute
- `an` - `a`ttribute `n`amespaced
- `p` - `p`roperty
- `ps` - `p`roperty `s`tatic
- `e` - `e`vent

### Change splitter

Use `setPropSplitter('_')` to change the global suffix splitter

### Example

```js
div({
  // auto-detect whether to set property or attribute
  id: 'abc',
  selected: 123,

  // property
  checked$p: 123,

  // property static
  onclick$ps: () => 'Clicked!',
  customFunction$ps: () => 'Custom component function property',

  // attribute
  class$a: 'visible',

  // attribute with namespace
  'xlink:href$an$http://www.w3.org/1999/xlink': 'abc',

  // add bubbling event listener
  click$e: () => 'Clicked!',

  // event with boolean options
  click$e$capture$once$passive: () => 'Clicked!',

  // all event options
  click$e: {
    handle: () => 'Clicked!', // or handle: {handleEvent: () => 'Clicked!'},
    capture: true,
    once: true,
    passive: true,
    signal: abort,
  },
});
```

## Functional Notation

While JSX allows for better visual separation between JavaScript and HTML, there is an alternative syntax that exists

> The visual separation in React can be hindered by the use of mangled camelCase prop names

Functional notation is better than JSX in the following ways:

- Faster, lighter, flexible
- Typechecks automatically between static `Element` and dynamic `Component<Element>`
- No need for a build/compile step/tool
- Just JavaScript, no new syntax, natural comments
- You have the ability to use multiple props objects and children arrays in any order, without the need for `...spread`-ing
- You don't need to capitalize your component names or have a single props object argument in the constructor, although it's recommended for interoperability with JSX

> While functional notation and JSX are fully interchangeable within Fusor components, it's important to pay attention to how you pass `children` to your components if you want both systems to be compatible, see: [jsx-fn-interoperability.spec.tsx]

```js
import {button, div, p, h} from '@fusorjs/dom/html';
import {svg, g, rect, s} from '@fusorjs/dom/svg';

div(childrenArray1, propsObject1, childrenArray2, propsObject2);
```

> The 'untagged' creators, such as `h` for HTML and `s` for SVG elements, are used for creating custom-elements but can also be used for creating standard elements `h('div', props, 'hello')`.

Use `h` for autonomous custom elements:

```js
import {h, p} from '@fusorjs/dom/html';
import '@fusorjs/dom/life'; // register fusor-life

const onconnected = () => console.log('Say hi when connected!');
const wrapper = h('fusor-life', {onconnected}, p('Hello!'));
```

Use `Options` for customized built-in elements:

```js
import {Options} from '@fusorjs/dom';
import {div, p} from '@fusorjs/dom/html';

const wrapper = div(new Options({is: 'custom-div'}), p('Hello!'));
```

> `Options` must be the first child.

## Component lifecycle

A custom element `fusor-life` and a helper creator `Life` are there at your service.

Use `Life` creator like this:

```js
import {Life} from '@fusorjs/dom/life';
const wrapper = Life(
  {
    connected$e: () => {},
    disconnected$e: () => {},
    adopted$e: () => {},
    attributeChanged$e: () => {},
    // ... other html props
  },
  // ... children
);
```

## Fusor vs React lifecycle

|            | Fusor       | fusor-life       | React                                                                                                |
| ---------- | ----------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| Creating   | constructor |                  |                                                                                                      |
| Mounting   |             | connected        | constructor, getDerivedStateFromProps, render, componentDidMount                                     |
| Updating   | update      | attributeChanged | getDerivedStateFromProps, shouldComponentUpdate, render, getSnapshotBeforeUpdate, componentDidUpdate |
| Unmounting |             | disconnected     | componentWillUnmount                                                                                 |
| Adopting   |             | adopted          |                                                                                                      |

## When DOM is updated

The current DOM value will be updated only if:

- new [primitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values) value has a different representation
- new object reference is different

Therefore, you can and should employ a caching strategy for referenced values

## You should cache components

Do this:

```jsx
const cachedOdd = <span>Odd</span>;
const cachedEven = <span>Even</span>;

let number = 0;

const page = <p>{() => (number % 2 ? cachedOdd : cachedEven)}</p>;

document.body.append(page.element);

setInterval(() => {
  number += 1;
  page.update();
}, 1000);
```

Instead of doing this:

```jsx
const page = <p>{() => (number % 2 ? <span>Odd</span> : <span>Even</span>)}</p>;
```

Because `<span>Odd</span>` or `<span>Even</span>` is recreated each second

## You should use dynamic props

Do this:

```jsx
const OddOrEven = ({number = () => 0}) => (
  <span>{() => (number() % 2 ? 'odd' : 'even')}</span>
);

let number = 0;

const page = (
  <p>
    <OddOrEven number={() => number} />
  </p>
);

document.body.append(page.element);

setInterval(() => {
  number += 1;
  page.update();
}, 1000);
```

Instead of doing this:

```jsx
const OddOrEven = ({number = 0}) => <span>{number % 2 ? 'odd' : 'even'}</span>;

const page = <p>{() => <OddOrEven number={number} />}</p>;
```

Because `<span>...</span>` is recreated each second

## You should update only what is necessary and when it is necessary

Do this:

```jsx
const component1 = <div>{() => dynamicValue}</div>;
const component2 = (
  <div>
    <div>
      <div>
        <div>{component1}</div>
      </div>
    </div>
  </div>
);

component1.update();
```

Instead of doing this:

```jsx
component2.update();
```

Because `component2.update()` is slower

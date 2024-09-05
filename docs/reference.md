# Reference

## Install

```sh
npm install @fusorjs/dom
```

## Configure

### Starter Projects

- **JSX**
  - **JavaScript**
    - [Webpack](https://github.com/fusorjs/dom-starter-jsx-webpack)
    - [Parcel](https://github.com/fusorjs/dom-starter-jsx-parcel)
    - [CodeSandbox](https://codesandbox.io/p/sandbox/fusor-intro-jsx-webpack-4m7r37?file=%2Fsrc%2Fapp.jsx)
  - **TypeScript**
    - [Webpack](https://github.com/fusorjs/dom-starter-tsx-webpack)
    - [Parcel](https://github.com/fusorjs/dom-starter-tsx-parcel)
    - [CodeSandbox](https://codesandbox.io/p/sandbox/fusor-intro-tsx-r96fgd?file=%2Fsrc%2Findex.tsx)
- **Functional Notation**
  - **JavaScript**
    - [Codesandbox](https://codesandbox.io/p/sandbox/fusor-intro-cvbhsk?file=%2Fsrc%2Findex.js%3A8%2C23)
  - **TypeScript**
    - Webpack - [Tutorial](https://github.com/fusorjs/tutorial) - [TodoMvc](https://github.com/fusorjs/todomvc)
    - [Codesandbox](https://codesandbox.io/p/sandbox/fusor-intro-ts-h3wlp5?file=%2Fsrc%2Findex.ts)

> [Functional/Hyper Notation](functional-notation.md) is more flexible, simpler to set up, does not require transpilation, available in JSX.

### Configure JSX

> `jsconfig.json` or `tsconfig.json`

Modern way:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@fusorjs/dom"
  }
}
```

Old way: (must `import {jsx} from '@fusorjs/dom'` in every `[j|t]sx` file)

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "jsx"
  }
}
```

## API

### Creating DOM

Fusor supports different styles for creating DOM. You can use all of them interchangeably.

> [Functional/Hyper Notation](functional-notation.md)

#### Creating HTML

| Notation   | Example                   | Setup                                   |
| ---------- | ------------------------- | --------------------------------------- |
| JSX        | `<div>Hello world</div>`  | [Configure](#configure) JSX             |
| Functional | `div('Hello world')`      | `import {div} from "@fusorjs/dom/html"` |
| Hyper      | `h('div', 'Hello world')` | `import {h} from "@fusorjs/dom"`        |

#### Creating SVG

| Notation   | Example                   | Setup                                  |
| ---------- | ------------------------- | -------------------------------------- |
| JSX        | `<svg>Hello world</svg>`  | [Configure](#configure) JSX            |
| Functional | `svg('Hello world')`      | `import {svg} from "@fusorjs/dom/svg"` |
| Hyper      | `s('svg', 'Hello world')` | `import {s} from "@fusorjs/dom"`       |

### Operating on DOM

Fusor creates DOM nodes wrapped in special data structures that are incompatible with browser functions. Here are the API methods to operate on them:

> `import {update, isUpdatable, getElement} from '@fusorjs/dom';`

- `update(node)` - update DOM node, update dynamic attributes and children recursively
- `isUpdatable(node)` - check if DOM node is updatable
- `getElement(node)` - retrieve normal DOM element

### Fusor Configuration

> `export {defaultPropSplitter, setPropSplitter} from './prop/initProp';`

- `defaultPropSplitter` = `_` - retrieve default property separator
- `setPropSplitter('$')` - set property separator

## Static vs Dynamic

### Static DOM Node

```jsx
const static1 = <div>Children that are not functions</div>;

const static2 = (
  <div>
    Children made out of other <b>static</b> DOM elements {static1}
  </div>
);

const static3 = (
  <div class="name">Attributes or properties that are not functions</div>
);

const static4 = <div click_e={() => 'event handler'} />;
```

### Dynamic DOM Node

```jsx
const dynamic1 = <div>{() => count} child is a function </div>;

const dynamic2 = <div>{dynamic1} child is a component</div>;

const dynamic3 = (
  <div class={() => name}>attribute or property is a function</div>
);
```

## Values

### Child Values

- `function` makes the child dynamic and applies its return value as shown below
- `string`, `number` wrapped in a `Text Node`
- `Node`s are applied as-is
- `true, false, null, undefined` are converted to empty `Text Node`s to enable logical expressions, ex: `isVisible && <ModalDialog />`
- `Array` values are applied to the element according to the rules shown above, including nested arrays applied recursively
- Everything else throws `TypeError` in development mode.

> A dynamic array updates its own related children before its termination node, which is added at the end.
>
> Dynamic arrays differ from static ones in that they do not create new dynamic nodes from their functional items
>
> Nested arrays are supported to enhance performance by avoiding the need to flatten them and create multiple array object copies
>
> Functions in dynamic arrays enhance performance and flexibility by allowing the creation of dynamic arrays once, without needing to recreate them when data changes

### Attribute Values

- `function` makes the attribute dynamic and applies its return value as shown below
- `number` converted to string.
- `string` applied as-is.
- `"", null, false, undefined` removes the attribute
- `true` sets the attribute to `""`
- Everything else throws `TypeError` in development mode.

### Property Values

- `function` makes the property dynamic and applies its return value as-is
- All other values are applied as-is

### Static Property Values

> with `ps` type, see: [types](#parameter-types)

- All values are applied as-is

### When DOM is updated?

The current DOM value will be updated only if:

- [primitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values) value has changed
- object value reference has changed

> Therefore, you should [cache](optimisation.md) referenced values

## Parameter Keys

There are three types of parameters:

- `p`roperty
- `a`ttribute
- `e`vent handler

### Special Properties

- `is` - custom element name
- `mount` - element connect callback (cannot be used with `is`)

> In functional notation they must be present in the first props object

```jsx
<div
  is="custom-element-name"
  mount={(self) => {
    self.update();
    return () => 'unmount';
  }}
/>
```

### Automatic Property or Attribute

- **Property**
  - Value is of reference type: `Object`, `Array`, `Function`... (not `null`)
  - If a property exists on that element: `id`, `class`, `style`...
- **Attribute** otherwise

```jsx
<div
  // Properties:
  id="exists"
  class="exists"
  name1={[1, 2, 3]}
  // Attributes:
  name2="str"
  name3={null}
/>
```

### Parameter Types

Specify `[name]_[type]`:

- `a` - `a`ttribute
- `an` - `a`ttribute `n`amespaced
- `p` - `p`roperty
- `ps` - `p`roperty `s`tatic
- `e` - `e`vent handler

> Use `setPropSplitter('$')` to change the global suffix separator from `_` to `$`

#### Property Keys

```jsx
<div
  // property
  name1_p="str"
  checked_p={456}
  // property static
  onclick_ps={(event) => 'Clicked!'}
  customFunction_ps={() => 'Custom component function property'}
/>
```

#### Attribute Keys

```jsx
<div
  // attribute
  myprop_a="visible"
  // attribute with namespace
  {...{'xlink:href_an_http://www.w3.org/1999/xlink': 'abc'}}
/>
```

> [Namespaces](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml)

#### Event Handler Keys

```jsx
<div
  // bubbling event listener
  click_e={(event, self) => 'Clicked!'}
  // capturing event listener
  click_e_capture={(event, self) => 'Clicked!'}
  // all possible boolean event options
  click_e_capture_once_passive_update={(event, self) => 'Clicked!'}
  // all event options object
  click_e={{
    handle: (event, self) => 'Clicked!',
    capture: true,
    once: true,
    passive: true,
    signal: AbortSignal,
    update: true, // update target component after event handler completes
  }}
  // override capture option to true in the key
  click_e_capture={{
    handle: (event, self) => 'Clicked!',
    capture: false,
  }}
  // event listener object
  click_e={{
    handleEvent: (event, self) => 'Clicked!',
  }}
  // event listener options with object
  click_e={{
    handle: {handleEvent: (event, self) => 'Clicked!'},
    capture: true,
  }}
/>
```

## Lifecycle

- `mount/unmount` implemented using standard [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks).
- This functionality is optional
- Fusor components can be used alongside Custom Elements
- When using `mount`, global Custom Element is registered for this specific element type, breaking purity to some extent
- SVG elements cannot have a lifecycle yet, but there is a [proposal](https://github.com/WICG/webcomponents/issues/634)

## JSX

### JSX Rules

- Fusor component names (HTML/SVG) start with lowercase letters
- Your component names must be Capitalized
- Your components can take a single `props` object argument

### SVG within JSX

Some SVG elements: `a`, `script`, `style`, `title` conflict with HTML elements with the same name. Therefore, you must prepend them with `s` like so: `sa`, `sscript`, `sstyle`, `stitle`.


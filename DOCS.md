# Documentation

## Component

A `Component` object holds a DOM Element and manages its _dynamic_ values.

It has two properties:

- `element`: gets the associated DOM Element object.
- `update`:
  - Propagates _dynamic_ values to the `element` (makes changes visible).
  - Calls all of the component's child updaters.
  - Returns `this` reference.

## Creators

These imported functions are creators:

```js
import {button, div, p} from '@fusorjs/dom/html';
```

A creator initializes a respective DOM Element and returns, depending on the presence of _dynamic_ values, either:

- this _static_ DOM Element
- new _dynamic_ `Component` object

> SVG creators are in `@fusorjs/dom/svg`.

> There are also "untagged" creators, such as `h` for HTML and `s` for SVG elements. They are used for creating non-standard/custom elements. But could be used for creating normal elements as well `h('div', props, 'hello')`.

## Static vs Dynamic

**Dynamic children** are:

- functions, like: `() => count`
- `Component` objects

**Dynamic props** are functions, like `{class: () => editing ? 'editing' : ''}`.

> Event handler props are _static_, like `{click$e: () => {}}`.

Everything else is _static_.

## Attributes vs Properties vs Events

To _automatically_ detect whether to set _property_ or _attribute_, do not use a _$-suffix_.
Set as _property_, if it is already defined on the element or if it is a _complex_ data value, otherwise set as an _attribute_.
Objects and arrays are _complex_ data.

Use a _$-suffix_ to manually define a type:

- `a` - `a`ttribute
- `an` - `a`ttribute `n`amespaced
- `p` - `p`roperty
- `ps` - `p`roperty `s`tatic
- `e` - `e`vent

Example:

```js
div({
  // auto-detect whether to set property or attribute
  selected: 123,

  // property
  checked$p: 123,

  // property static
  onclick$ps: () => 'Clicked!',

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

Values:

- _Property_ values will be applied as they are.
- _Attribute_ is removed if equal to `"", null, false, undefined`, everything else will be converted to a string.

`defaultPropSplitter = $` and `setPropSplitter('_')` for managing global splitter property setting.

## Children

A child can be of any value:

- Boolean values are not shown, so you could do logical expressions like `isVisible && modalDialog`.
- _Static_ array values are treated as the usual children.
- _Dynamic_ array values will replace associated children.

## Updating

When a `Component` updates, it calls every associated _dynamic_:

- prop function
- child function
- child `Component.update` method

And then it will update the DOM only if:

- the value has changed
- the _dynamic_ array reference has changed

> You should call update `update` only when necessary for performance.

## Caching

If you create Component in _dynamic_ child, for example `p(() => div(() => ++count))`, it will be re-created every time it's parent is updated.

You could cache it in a variable:

```ts
let cache;
p(() => cache?.update() ?? (cache = div(() => ++count)));
```

Also the same applies to _dynamic_ arrays: `p(() => [div(() => ++count)])`.

## LifeCycle & Custom Elements

You could implement life-cycle events unsing custom elements, but wait, we already done it for you.

The custom element `fusor-life` and the helper wrapper creator `Life` are there for your service.

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

Use `h` for autonomous custom elements:

```js
import {h, p} from '@fusorjs/dom/html';
import '@fusorjs/dom/life'; // define fusor-life
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

## HTML/SVG

HTML/SVG creator functions for your convenience.
They serve as a reference point, so you could easily re-implement them if you need them.

> An HTML/SVG `Component.element` never changes.

## Functional Notation vs JSX

- Just Javascript, no new syntax, natural comments.
- No need for a build/compile step/tool.
- Use multiple props objects and children arrays in any order.

```js
div(childrenArray1, propsObject1, childrenArray2, propsObject2);
```

> You do not need to spread `...` objects or arrays.

## Naming Conventions

HTML/SVG:

- Built-in HTML/SVG creator names are all lowercase for consistency with the spec.
- HTML events are case-sensitive and mostly lower-cased.

Yours:

- Uppercase your creators like `UnitSelector` so you could distinguish them from built-ins.
- Also, you could instantiate with lower case variable `const unitSelector = UnitSelector()`.
- Use camelCase for your event names like `doTheWork`.

## Fusor vs React

|                       | Fusor                   | React                                           |
| --------------------- | ----------------------- | ----------------------------------------------- |
| Component constructor | Explicit, function      | Combined with updater in funtion components     |
| Objects in Component  | Created once            | Re-created on each update even with memoization |
| State, effects, refs  | Variables and functions | Complex, hooks subsystem, verbose               |
| Updating components   | Explicit, flexible      | Implicit, complex, diffing                      |
| DOM                   | Real                    | Virtual                                         |
| Events                | Native                  | Synthetic                                       |
| Life-cycle            | Native, custom elements | Complex, tree walking                           |

### Life-Cycle

|            | Fusor       | fusor-life       | React                                                                                                |
| ---------- | ----------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| Mounting   | constructor | connected        | constructor, getDerivedStateFromProps, render, componentDidMount                                     |
| Updating   | update      | attributeChanged | getDerivedStateFromProps, shouldComponentUpdate, render, getSnapshotBeforeUpdate, componentDidUpdate |
| Unmounting |             | disconnected     | componentWillUnmount                                                                                 |

### Separation of concerns

|                  | Fusor        | React                             |
| ---------------- | ------------ | --------------------------------- |
| Create Component | Constructor  | Constructor + Update              |
| Update Component | Update       | Constructor + Update              |
| Set State        | Set Variable | Set State + Constructror + Update |

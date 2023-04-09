# Documentation

## Attributes vs Properties vs Events

Keys:

- `automatic`: property if already defined on element or complex data value, otherwise attribute
- `property$p`: set property
- `attribute$a`: set attribute
- `event$e`: add event listener

Three types of manual keys:

- `a`ttribute
- `p`roperty
- `e`vent

Values:

- Automatic properties: objects, arrays.
- Property values will be applied as they are.
- Attribute is removed: `"", null, false, undefined`, everything else will be converted to string.

Event keys:

- `event$e`: default bubling event
- `event$e$capture$once$passive`: all boolean parameters

Complete event:

```js
div({
  click$e: {
    handle: () => 'Clicked!',
    capture: true,
    once: true,
    passive: true,
    signal: abort,
  },
});
```

> `handle` can also be object with `handleEvent` property

Namespaced attribute keys:

- `"xmlns:xlink$a$http://www.w3.org/1999/xlink"`

## Children

A child can be of any value:

- Boolean values are not shown, so you could do logical expressions: `isVisible && modalDialog`.
- Static array values are treated as the usual children (nested arrays not supported yet).
- Dynamic array values will replace ~~associated children~~ (it is in development, currently **all children will be replaced**, just use a single dynamic children array for now).

## Updating

When `Component` updates, it calls every associated dynamic:

- prop function
- child function
- child `Component.update` method

And then it will update the DOM only if:

- the value has changed
- the dynamic children array reference has changed

> You should try to update only necessary components for performance.

## Caching

- If you create Component in dynamic child, ex: `p(() => div(() => ++count))`, tt will be re-created every time its parent is updated.
- Yoc can cache it, ex: `` and then:

```ts
let cache: undefined | Component<HTMLElement>;
// then use it
p(() => cache?.update() ?? (cache = div(() => ++count)));
```

- Also the same applies to dynamic child arrays: `p(() => [div(() => ++count)])`.

## HTML/SVG

HTML/SVG created functions for your convinience and as a reference so you could re-implement them as you see fit to your needs.

## Custom Elements

Autonomous custom elements:

```js
import {h, p} from '@fusorjs/dom/html';
const onconnected = () => console.log('Say hi when connected!');
const wrapper = h('fusor-events', {onconnected}, p('Hello!'));
```

Customized built-in elements:

```js
import {Options} from '@fusorjs/dom/core';
import {div, p} from '@fusorjs/dom/html';
const wrapper = div(new Options({is: 'name'}), p('Hello!'));
```

> `Options` must be the first or second child

## More Facts

- A Fusor's HTML/SVG `Component.element` never changes.
- Your dynamic child function can return different DOM Element or any other value.
- Dynamic children arrays can have dynamic elements.
- Use `is` attribute to attach custom element (it must be in the first props object)

## Functional Notation vs JSX

- Just Javascript, no new syntax, natural comments.
- No need for a build/compile step/tool.
- Use many props objects and children arrays in any order.

```js
div(childrenArray1, propsObject1, childrenArray2, propsObject2);
```

> You do not need to spread `...` objects or arrays.

## Naming Conventions

- element component names are all lowercased, uppercase your components so you could instantiate them like this: `const unitSelector = UnitSelector()`
- element event handlers are lovercase (e.g.: `onchange(Event)`). To distingush from your event handlers use camelCase (e.g.: `onChange(value)`)

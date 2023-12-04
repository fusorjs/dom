# Functional Notation

While JSX allows for better visual separation between JavaScript and HTML, there is an alternative syntax that exists

> The visual separation in React can be hindered by the use of mangled/camelCase prop names

Functional notation is better than JSX in the following ways:

- Faster, lighter, flexible
- Typechecks automatically between static `Element` and dynamic `Component<Element>`
- No need for a build/compile step/tool
- Just JavaScript, no new syntax
- natural comments, try in JSX comment a block of code that contains `{/* comment */}`
- You have the ability to use multiple props objects and children arrays in any order, without the need for `...spread`-ing
- You don't need to capitalize your component names or have a single props object argument in the constructor, although it's recommended for interoperability with JSX

> While functional notation and JSX are fully interchangeable within Fusor components, it's important to pay attention to how you pass `children` to your components if you want both systems to be compatible, see: [interoperability](../src/spec/jsx-fn-interoperability.spec.tsx)

```js
import {button, div, p, h} from '@fusorjs/dom/html';
import {svg, g, rect, s} from '@fusorjs/dom/svg';

div(childrenArray1, propsObject1, childrenArray2, propsObject2);
```

> The "untagged" creators, such as `h` for HTML and `s` for SVG elements, are used for creating custom-elements but can also be used for creating standard elements `h('div', props, 'hello')`.

Use `h` for autonomous custom elements:

```js
import {h, p} from '@fusorjs/dom/html';

const wrapper = h('custom-elm', {onconnected}, p('Hello!'));
```

```js
import {div, p} from '@fusorjs/dom/html';

const wrapper = div({is: 'custom-div'}, p('Hello!'));
```

> `is` and `mount` must be in the first child.

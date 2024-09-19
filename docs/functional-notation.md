# Functional Notation

While JSX arguably allows for better visual separation between JavaScript and HTML, a more flexible alternative syntax exists.

## Example

```js
import {getElement} from '@fusorjs/dom';
import {button, div, p} from '@fusorjs/dom/html';

const CountingButton = (count = 0) =>
  button(
    {
      click_e_update: () => (count += 1),
    },
    'Clicked ',
    () => count,
    ' times.',
  );

const App = () =>
  div(
    p('Three counting buttons'),
    CountingButton(),
    CountingButton(22),
    CountingButton(333),
  );

document.body.append(getElement(App()));
```

> [CodeSandbox](https://codesandbox.io/p/sandbox/cvbhsk?file=%2Fsrc%2Findex.js%3A8%2C23)

## FN vs JSX

Functional notation is better than JSX in the following ways:

- Faster, lighter, flexible
<!-- - Typechecks automatically between static `Element` and dynamic `Component<Element>` (not in v3 anymore) -->
- No need for a build/compile step/tool
- Just JavaScript, no new syntax
- Natural comments, try in JSX, comment a block of code that contains another `{/* comment */}`
- You have the ability to use multiple props objects and children arrays in any order, without the need for `...spread`-ing
- You can use nested arrays without flattening
- You don't need to capitalize your component names or have a single props object argument in the constructor, although it's recommended for interoperability with JSX

> While functional notation and JSX are fully interchangeable within Fusor components, it's important to pay attention to how you pass `children` to your components if you want both systems to be compatible, see: [interoperability](../src/spec/jsx-fn-interoperability.spec.tsx)

```js
import {h, s} from '@fusorjs/dom';
import {button, div, p} from '@fusorjs/dom/html';
import {svg, g, rect} from '@fusorjs/dom/svg';

div(childrenArray1, propsObject1, childrenArray2, propsObject2);
```

## Hyper Notation

> The "untagged" creators, such as `h` for HTML, `s` for SVG, and `m` for MathML, are used for creating custom-elements but can also be used for creating standard elements `h('div', props, 'hello')`.

Use `h` for autonomous custom elements:

```js
import {h} from '@fusorjs/dom';
import {p} from '@fusorjs/dom/html';

const wrapper = h('custom-elm', {onconnected}, p('Hello!'));
```

```js
import {div, p} from '@fusorjs/dom/html';

const wrapper = div({is: 'custom-div'}, p('Hello!'));
```

> `is` and `mount` must be in the first child.

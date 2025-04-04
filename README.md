# Fusor

**Fusor is a simple JavaScript library that helps create and update DOM elements.**

<!-- Moreover, with Fusor and **vanilla** JavaScript, you can achieve everything that other major frameworks offer without sacrificing conciseness. -->

It is:

- **Simple** ― two API methods: `create` & `update` DOM
- **Concise** ― less verbose than anything else
- **Explicit** ― what you see is what you get, no black box magic
- **Flexible** ― as using pure functions, both declarative and imperative
- **Small/Performant** ― size [~3kB](https://bundlephobia.com/package/@fusorjs/dom@2.5.2), no dependencies
- **W3C Standards Compliant**
<!-- - **Performant** ― full control over: DOM creation/updates, state, context, diffing, concurrency -->

## Install

```sh
npm install @fusorjs/dom
```

Or:

- **JSX** boilerplate for: [JavaScript](https://github.com/fusorjs/dom-starter-jsx-webpack) or [TypeScript](https://github.com/fusorjs/dom-starter-tsx-webpack)
- **CDN**: <https://esm.sh/@fusorjs/dom> or <https://cdn.skypack.dev/@fusorjs/dom>

## Examples

<!-- [**TRY THEM LIVE**](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx) -->

### Create & Update DOM

```js
import {getElement, update} from '@fusorjs/dom';
import {section, div} from '@fusorjs/dom/html';

let count = 0;

const block = section(
  {class: () => (count % 2 ? 'odd' : 'even')},

  div('Seconds ', () => count, ' elapsed'),
  div('Minutes ', () => Math.floor(count / 60), ' elapsed'),
);

document.body.append(getElement(block));

setInterval(() => {
  count++;
  update(block);
}, 1000);
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/Byavpez?editors=0110)

Only tiny portions of the `block` DOM tree are updated if they differ from the current values.

### JSX Support

```jsx
import {getElement, update} from '@fusorjs/dom';

let count = 0;

const block = (
  <section class={() => (count % 2 ? 'odd' : 'even')}>
    <div>Seconds {() => count} elapsed</div>
    <div>Minutes {() => Math.floor(count / 60)} elapsed</div>
  </section>
);

document.body.append(getElement(block));

setInterval(() => {
  count++;
  update(block);
}, 1000);
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/NPWeORL?editors=1100)

### Parameters & Children Syntax

<!-- prettier-ignore -->
```js
import {getElement, update} from '@fusorjs/dom';
import {section} from '@fusorjs/dom/html';

let count = 0;

const block = section(
  {
    id: 'set attribute or property automatically',
    title_a: 'set attribute',
    style_p: 'set property',

    focus_e: () => 'set bubbling event handler',
    blur_e_capture_once: () => 'set capturing event handler once',

    // update dynamic values in this DOM node:
    click_e_update: () => count++, // same as
    click_e: () => {count++; update(block);}, // same as
    click_e: (event, self) => {count++; update(self);},

    class: count % 2 ? 'odd' : 'even', // static
    class: () => (count % 2 ? 'odd' : 'even'), // dynamic
  },

  'Static child ', count, ' never changes.',
  'Dynamic child ', () => count, ' is wrapped in a function.',
);

document.body.append(getElement(block));
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/dPywxMB?editors=0110)

### Stateful Component

<!--
// This function runs once on creation, generating a DOM element
// and its updater function. On update, only its dynamic values
// are diffed and its DOM node is updated.
-->

```js
import {getElement} from '@fusorjs/dom';
import {button, div} from '@fusorjs/dom/html';

const ClickCounter = (count = 0) =>
  button({click_e_update: () => count++}, 'Clicked ', () => count, ' times');

const App = () => div(ClickCounter(), ClickCounter(22), ClickCounter(333));

document.body.append(getElement(App()));
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/RNwvNwb?editors=0010)

### JSX Version

```jsx
import {getElement} from '@fusorjs/dom';

const ClickCounter = ({count = 0}) => (
  <button click_e_update={() => count++}>Clicked {() => count} times</button>
);

const App = () => (
  <div>
    <ClickCounter />
    <ClickCounter count={22} />
    <ClickCounter count={333} />
  </div>
);

document.body.append(getElement(<App />));
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/mydvyBV?editors=1000)

Components in both versions are interoperable.

### Controlled Input Component

```js
import {getElement} from '@fusorjs/dom';
import {input, div} from '@fusorjs/dom/html';

const UppercaseInput = (value = '') =>
  input({
    value: () => value.toUpperCase(),
    input_e_update: (event) => (value = event.target.value),
  });

document.body.append(
  getElement(
    div(UppercaseInput(), UppercaseInput('two'), UppercaseInput('three')),
  ),
);
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/wBvNBme?editors=0010)

## Documentation

- [**TUTORIAL**](docs/tutorial.md)
- [Reference](docs/reference.md)
- [JSX vs Functional Syntax](docs/functional-notation.md)
- [Optimization](docs/optimisation.md)
- [Fusor vs React](docs/fusor-vs-react.md)
- [Fusor vs React Verbosity](docs/fusor-vs-react-verbosity.md)

## Applications

- [TodoMvc](https://github.com/fusorjs/todomvc)
- [Tutorial](https://github.com/fusorjs/tutorial)

## Contributing

Your suggestions and contributions are always welcome!

Please see [CONTRIBUTING](CONTRIBUTING.md) for details and [CHANGELOG](CHANGELOG.md) for agenda.

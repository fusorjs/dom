# Almost Vanilla Frontend

Almost — because only two functions from a library are used:

1. `Create` DOM Element
2. `Update` DOM Element

**[Fusor](https://github.com/fusorjs/dom) is a simple JavaScript library that helps create and update DOM elements.**

---

Using the library instead of the native DOM API is beneficial because it is:

1. Declarative
2. Easy to understand and reason about
3. Less verbose

There are many examples of common problems below. Try to recreate them using the tools you are currently using. You might be surprised to find that developing with Fusor is the most concise, flexible, lightweight, and performant way to build frontend applications.

<!--

# Embed
https://qna.habr.com/q/375284
https://dev.to/mwanahamuntu_/how-to-embed-your-codepens-into-your-dev-to-posts-it-s-easy-4iji

-->

## Contents

- [Install](#install)
- [Create & Update DOM](#create--update-dom)
- [Parameters & Children Syntax](#parameters--children-syntax)
- [Stateful Component](#stateful-component)
- [Controlled Input Component](#controlled-input-component)
- [Precise DOM Update](#precise-dom-update)
- [Escape Update Recursion](#escape-update-recursion)
- [Component Lifecycle](#component-lifecycle)
- [Automatic/Reactive Updates](#automaticreactive-updates)
- [Routing](#router-library)
- [Switching Components](#reactive-component)
- [Create & Update DOM Dynamically](#create--update-dom-dynamically)
- [Caching & Memoization](#caching--memoization)
- [Exception Handling](#exception-handling)

## Install

```sh
npm install @fusorjs/dom
```

Or:

- **JSX** boilerplate project: [JavaScript](https://github.com/fusorjs/dom-starter-jsx-webpack) , [TypeScript](https://github.com/fusorjs/dom-starter-tsx-webpack)
- **CDN**: <https://esm.sh/@fusorjs/dom> , <https://cdn.skypack.dev/@fusorjs/dom>

## Create & Update DOM

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

## JSX Support

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

## Parameters & Children Syntax

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

## Stateful Component

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

### Same Component Defined Differently

<!-- prettier-ignore -->
```js
import {button} from '@fusorjs/dom/html';

const ClickCounter = (count = 0) => {
  const self = button(
    {click_e: () => {count++; update(self);}},
    'Clicked ', () => count, ' times',
  );

  return self;
};

const ClickCounter = (count = 0) =>
  button(
    {click_e: (event, self) => {count++; update(self);}},
    'Clicked ', () => count, ' times',
  );

const ClickCounter = (count = 0) =>
  button(
    {click_e_update: () => count++},
    'Clicked ', () => count, ' times',
  );
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/RNwvPVZ?editors=0010)

## Controlled Input Component

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

## Precise DOM Update

```js
import {getElement, update} from '@fusorjs/dom';
import {section, div} from '@fusorjs/dom/html';

let count = 0;

const seconds = div('Seconds ', () => count, ' elapsed');

const block = section(
  seconds,
  div('Minutes ', () => Math.floor(count / 60), ' elapsed'),
);

document.body.append(getElement(block));

setInterval(() => {
  count++;
  update(seconds); // not minutes
}, 1000);
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/JojxdwW?editors=0010)

This will update only the seconds, not the minutes.

## Escape Update Recursion

```js
import {getElement, update} from '@fusorjs/dom';
import {section, div} from '@fusorjs/dom/html';

let count = 0;

const seconds = div('Seconds ', () => count, ' elapsed');

const block = section(
  () => seconds, // wrapped in a function to escape
  div('Minutes ', () => Math.floor(count / 60), ' elapsed'),
);

document.body.append(getElement(block));

setInterval(() => {
  count++;
  update(block);
}, 1000);
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/ogNmXro?editors=0010)

This will update only the minutes, not the seconds.

Only components (`seconds`, `block`) are updated recursively. `() => seconds` is a `function`, not a component.

Every function from `@fusorjs/dom/html` returns a component, provided it contains dynamic values. The same applies to JSX definitions.

## Component Lifecycle

1. **Create** component
2. **Connect** to DOM
3. **Update** DOM
4. **Disconnect** from DOM

<!-- prettier-ignore -->
```js
import {getElement, update} from '@fusorjs/dom';
import {div} from '@fusorjs/dom/html';

const IntervalCounter = (count = 0) => {
  console.log('1. Create component');

  return div(
    {
      mount: (self) => {
        console.log('2. Connect to DOM');

        const timerId = setInterval(() => {
          count++;
          update(self);
          console.log('3. Update DOM');
        }, 1000);

        const unmount = () => {
          clearInterval(timerId);
          console.log('4. Disconnect from DOM');
        };

        return unmount;
      },
    },

    'Since mounted ', () => count, ` seconds elapsed`,
  );
};

const instance = IntervalCounter(); // 1. Create component
const element = getElement(instance);

document.body.append(element); // 2. Connect to DOM
setTimeout(() => element.remove(), 15000); // 4. Disconnect from DOM
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/YPzByyv?editors=0011)

[> run SVG Analog Clock](https://codepen.io/Igor-S-the-scripter/pen/PwoVmVB?editors=1100)

<!-- # Common Recipes -->

## Automatic/Reactive Updates

Automatic/reactive updates in big frameworks are nothing more than an implementation of the Observable pattern. This includes State in React, Signals in Solid, Redux, MobX, and many others. In Fusor, you can use any of those libraries.

Here, we discuss the generic solution:

### Router Library

```js
import {update} from '@fusorjs/dom';
import {Observable} from 'Any/Observable/Signal/Redux/Mobx...';

// Modern routing handling
const observable = new Observable();
const read = () => location.hash.substring(1); // omit "#"
let route = read();
window.addEventListener(
  'popstate',
  () => {
    const next = read();
    if (route === next) return;
    route = next;
    observable.notify();
  },
  false,
);

// Fusor integration
export const getRoute = () => route;
export const mountRoute = (self) => {
  const callback = () => update(self);
  observable.subscribe(callback);
  return () => observable.unsubscribe(callback);
};
```

### Reactive Component

Switching components when current route is selected.

```js
import {span, a} from '@fusorjs/dom/html';
import {getRoute, mountRoute} from './router';

export const RouteLink = (title, route) =>
  span({mount: mountRoute}, () =>
    getRoute() === route
      ? title // when selected
      : a({href: `#${route}`}, title),
  );
```

### Create & Update DOM Dynamically

```js
import {getElement} from '@fusorjs/dom';
import {ul, li} from '@fusorjs/dom/html';
import {RouteLink} from './RouteLink';

const block = ul(
  [...Array(10)].map((v, i) =>
    li(RouteLink(`${i + 1}. Section`, `url-to-${i + 1}-section`)),
  ),
);

document.body.append(getElement(block));
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/QwWYgBy?editors=0010)

## Caching & Memoization

The heavy component is created only once.

```jsx
import {div, br} from '@fusorjs/dom/html';

let isVisible = true; // can change

const block = div(
  (
    (cache = HeavyComponent()) =>
    () =>
      isVisible && cache
  )(),

  br(),

  () => RecreatedEveryUpdate(),
);
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/bNGzoZO?editors=0011)

## Exception Handling

```js
import {section, p} from '@fusorjs/dom/html';

const Value = (value) => {
  if (value === undefined) throw new Error(`provide a value`);

  return p(value);
};

const block = section(
  p('Before'),

  (() => {
    try {
      return [
        Value(1),
        Value(), // will throw
        Value(3),
      ];
    } catch (error) {
      if (error instanceof Error) return p('Exception: ', error.message);

      return p('Exception: unknown');
    }
  })(),

  p('After'),
);
```

[> run this example](https://codepen.io/Igor-S-the-scripter/pen/vEYbWeV?editors=0010)

<!-- ## Async/Await

```js
import {getElement} from '@fusorjs/dom';
import {ul, li} from '@fusorjs/dom/html';
import {RouteLink} from './RouteLink';

const block = ul([...Array(10)].map((v, i) => li('Item number:', i + 1)));

document.body.append(getElement(block));
``` -->

## The End

Now you know everything you need to start developing modern front-end applications with Fusor.

Developing with Fusor is the most concise, flexible, lightweight, and performant way to build frontend applications.

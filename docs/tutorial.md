# Fusor Tutorial

## New Frontend Framework? Or Vanilla JavaScript with Two Helper Functions?

In this tutorial, I will discuss how to develop reusable web **components** using the [Fusor library](https://github.com/fusorjs/dom) and the benefits of doing so.

Such components can then be composed into full-fledged web applications on par with those created using **React, Angular, Vue, Solid, Svelte**, and others.

The Fusor API consists of only **two** main functions:

- **Create** a DOM element wrapped in a special object.
- **Update** a DOM element wrapped in a special object.

Plus a few more rarely used functions like:

- **Get** a DOM element from a special object.

You do not need to know anything about this special object.

## Create a DOM Element

### Creation via JSX

```jsx
import {getElement} from '@fusorjs/dom';

const count = 0;

// Create via JSX
const message = <div>Seconds {count} elapsed</div>;

document.body.append(getElement(message)); // Get
```

We used the **create** and **get** API functions.

### Alternative Non-JSX Creation

```js
import {div} from '@fusorjs/dom/html';
const message = div('Seconds ', count, ' elapsed'); // Create
```

## Update a DOM Element

```jsx
import {getElement, update} from '@fusorjs/dom';

let count = 0;
const message = <div>Seconds {() => count} elapsed</div>; // Create

document.body.append(getElement(message)); // Get

setInterval(() => {
  count += 1;
  update(message); // Update
}, 1000);
```

We used the **update** API function. It updates a DOM element and all of its children **recursively**. It retrieves new values from the results of functions, making them **dynamic**.

Children, attributes, and properties can all be dynamic.

```jsx
<div class={() => (toggle ? 'on' : 'off')} />
```

DOM updates will occur only if the new values **differ** from the current ones.

## Setting Parameters

Most of the time, you will set the parameters as usual:

```jsx
<div style="padding:1em" />
```

However, sometimes you will need to distinguish between **attributes** and **properties**. To specify their **type**, you can add `_a` or `_p` suffixes to their names:

```jsx
<div name1_a="attribute" name2_p="property" />
```

To add an **event handler**, you must always use an `_e` suffix:

```jsx
<div click_e={() => 'event handler'} />
```

There are [additional types](https://github.com/fusorjs/dom/blob/main/docs/reference.md#parameter-keys), and some of them can take extra **options** to ensure full **W3C standards** compatibility:

```jsx
<div click_e_capture_once={() => 'event handler'} />
```

## Create a Reusable Component

Compose your components using Fusor's special objects. Encapsulate state and parameters inside functions. Capitalize your component names.

Here is an example of a counting button component:

```jsx
import {getElement, update} from '@fusorjs/dom';

const CountingButton = (props) => {
  let count = props.count ?? 0; // Init State

  const self = (
    <button
      click_e={() => {
        count += 1;
        update(self);
      }}
    >
      Clicked {() => count} times
    </button>
  );

  return self;
};

const App = () => (
  <div style="padding:1em">
    <p>Three counting buttons</p>
    <CountingButton />
    <CountingButton count={22} />
    <CountingButton count={333} />
  </div>
);

document.body.append(getElement(App()));
```

The `CountingButton` component updates only **part** of its own DOM element without affecting the rest of the application.

Once you fully understand how the above component works, you can rewrite it in a slightly **shorter** manner while achieving the same result:

```jsx
const CountingButton = ({count = 0}) => (
  <button
    click_e={(event, self) => {
      count += 1;
      update(self);
    }}
  >
    Clicked {() => count} times
  </button>
);
```

Every event handler callback function receives two arguments: the standard event object and the current special object.

Once again, if you understand the example above, check out the **shortest** version of the same component:

```jsx
const CountingButton = ({count = 0}) => (
  <button click_e_update={() => (count += 1)}>
    Clicked {() => count} times
  </button>
);
```

We added the `update` option to refresh the component after the event handler callback is called, which is equivalent to the previous example.

## Lifecycle

The last aspect we need to understand before diving into developing real-world applications is the component lifecycle.

It consists of only four stages:

1. **Create** the component
2. **Connect** to the DOM
3. **Update** the DOM
4. **Disconnect** from the DOM

```jsx
import {getElement, update} from '@fusorjs/dom';

const IntervalCounter = ({count = 0}) => {
  console.log('1. Create the component');

  return (
    <div
      mount={(self) => {
        console.log('2. Connect to the DOM');

        const timerId = setInterval(() => {
          count++;
          update(self);
          console.log('3. Update the DOM');
        }, 1000);

        return () => {
          clearInterval(timerId);
          console.log('4. Disconnect from the DOM');
        };
      }}
    >
      Since mounted {() => count} seconds elapsed
    </div>
  );
};

const instance = <IntervalCounter />;
const element = getElement(instance);

document.body.append(element);
setTimeout(() => element.remove(), 15000);
```

The `mount` property has a function that runs when the component is added to the DOM. This function takes one argument: the current special object. It can also return another function that runs when the component is removed from the DOM.

We fully control these four stages of the lifecycle. This lets us create, update, and **compare** components using custom **asynchronous** or **concurrent** methods, with different strategies and animation frames in mind.

## This Concludes the Tutorial

As you can see from this tutorial, Fusor is simple, concise, and explicit. Most of the time, you will only use its **two** API functions. However, it also offers a lot of control and flexibility when needed.

So, to answer the question in the title, Fusor is a small JavaScript library, not a framework, but it can achieve the same results as other frameworks.

## Start Coding

All the examples above are available on [CodeSandbox](https://codesandbox.io/p/sandbox/4m7r37?file=%2Fsrc%2Fapp.jsx).

Also, check out the [SVG Analog Clock](https://codesandbox.io/p/sandbox/fusor-analog-clock-jsx-hqs5x9?file=%2Fsrc%2Findex.tsx) example.

Here is a [real-world application](https://github.com/fusorjs/tutorial).

Boilerplate starter projects:

- [**JavaScript Starter**](https://github.com/fusorjs/dom-starter-jsx-webpack)
- [**TypeScript Starter**](https://github.com/fusorjs/dom-starter-tsx-webpack)

## Thank You

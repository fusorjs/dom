# Fusor

Fusor is a simple JavaScript library that helps declaratively create and update DOM elements

> It combines or _fuses_ elements within the DOM

## Example

```jsx
import {jsx} from '@fusorjs/dom';

const Page = () => (
  <div>
    <p>Hello World</p>
    <CountingButton />
    <CountingButton init={22} />
    <CountingButton init={333} />
  </div>
);

const CountingButton = props => {
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

document.body.append(Page().element);
```

[Play with CountingButton example](https://codesandbox.io/s/fusor-intro-jsx-r96fgd?file=/src/index.ts)

## Fusor is similar to React

Fusor was inspired by React, and they both share the same ideas:

- Composable components
- One-way data flow
- JSX

## Fusor is different from React

The fundamental difference lies in component lifecycle. Unlike React, Fusor better applies the principle of _separation of concerns_ or _single-responsibility principle_

### Separation of concerns

| Concern                  | Fusor     | React                        |
| ------------------------ | --------- | ---------------------------- |
| Component creation       | create()  | create_update()              |
| Component state changing | state = x | setState(x); create_update() |
| Component updating       | update()  | create_update()              |

### Consequences of separation of concerns

| Concern        | Fusor                                    | React                                            |
| -------------- | ---------------------------------------- | ------------------------------------------------ |
| Component data | Created once on initialization           | Recreated on initialization and every update     |
| Side effects   | Simply set variables and call update     | Complex and verbose _hooks_ logic                |
| Updates        | Explicitly update what and when you want | Implicit, heavy, diffing, new _concurrent_ logic |

### Other differences

| Feature                | Fusor             | React         |
| ---------------------- | ----------------- | ------------- |
| DOM                    | Real              | Virtual       |
| Events                 | Native            | Synthetic     |
| Lifecycle              | Native            | Complex logic |
| Attribute names        | W3C Specification | Mangled       |
| Web components support | Complete          | Incomplete    |

## Why Fusor

- It is simple, lightweight, explicit, flexible and compatible
- It extensively utilizes modern JavaScript and browser features
- It follows the principle of doing one thing and doing it well, which is managing DOM elements
- It has **zero** dependencies and is only around **2kB** in size

## Documentation

Start with this fine [TUTORIAL](TUTORIAL.md)

For more in-depth information, please refer to this [REFERENCE](REFERENCE.md)

Read the first [article](https://gist.github.com/isumix/48b9de9c40ca5498d10224ca63f4876d) about Fusor

## Examples

[Analog clock](https://codesandbox.io/s/fusor-analog-clock-jsx-hqs5x9)

[Main usage scenarios](https://fusorjs.github.io/tutorial/): Routing, Request, Lifecycle, SVG, JSX...

[Todo-list application](https://github.com/fusorjs/todomvc#readme)

## Contribute

Your contributions are welcome

Please see [CHANGELOG](CHANGELOG.md) for details

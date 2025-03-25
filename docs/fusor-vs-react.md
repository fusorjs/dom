# Fusor vs React

## Not Another React Clone

While Fusor shares some concepts with React, it sets itself apart by taking a more flexible and minimalist approach.

React is like a monolithic black box where everything is managed internally: DOM creation/updating/diffing, state, context, concurrency, lifecycle, etc.

Fusor is like a set of Lego bricks. It was designed to show that all of these elements can be managed externally, explicitly, with less complexity and verbosity.

Why manage it externally? Because explicit control is often better than implicit, and sometimes flexibility or fine-tuning is necessary.

Fusor shifts its focus away from React complexities—like hooks, lifecycle methods, concurrency, and suspense—to emphasize a stronger understanding of JavaScript (including async/await) and core programming concepts, such as the observable pattern.

Check out Fusor! It offers only two main methods. While it resembles React, it helps you learn JavaScript and essential programming concepts without the need to master React’s intricate details.

## Common Features

Fusor was inspired by React, and they both share the same ideas:

- Composable functional components
- One-way data flow
- JSX
- DOM updates only if a value or reference changes
- Minimal DOM updates
- Updates to the parent component will trigger the necessary updates in its children

## The main difference

The fundamental difference lies in the separation of concerns within the component lifecycle (aka single-responsibility principle in SOLID)

<table>
<tr><th></th><th>Fusor</th><th>React</th></tr>
<tr><td>Init state</td><td>let state = 0;</td><td rowspan="2">useState(0) + render();</td></tr>
<tr><td>Create DOM</td><td>create();</td></tr>
<tr><td>Change state</td><td>state = 1;</td><td rowspan="2">setState(1) + render();</td></tr>
<tr><td>Update DOM</td><td>update();</td></tr>
</table>

<!-- https://legacy.reactjs.org/docs/reconciliation.html -->

## Benefits

|                     | Fusor                                                       | React                                                                                                             |
| ------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Component data      | Created **once** on initialization                          | Created on initialization and recreated on **every** update                                                       |
| Side effects        | Normal JavaScript flow                                      | Complex and verbose _hooks_ mechanics                                                                             |
| Component updates   | Explicit/precise, update what and when you need             | Implicit, complex, whole tree diffing                                                                             |
| Philosophy          | Lego, everything is controlled by the user                  | Black box monolith, automatically handles everything                                                              |
| Verbosity           | [Less verbose](fusor-vs-react-verbosity.md)                 | [More verbose](fusor-vs-react-verbosity.md)                                                                       |
| Component functions | Pure                                                        | Context is required                                                                                               |
| Concurrency         | Explicit                                                    | Implicit                                                                                                          |
| Library size (gz)   | [~3kB](https://bundlephobia.com/package/@fusorjs/dom@2.5.2) | [~2kB](https://bundlephobia.com/package/react@18.3.1) + [41kB](https://bundlephobia.com/package/react-dom@18.3.1) |

> React Hooks depend not only on the `deps` array but also on the component instances, which does not allow fully reusing memoized data across multiple components.

## Code samples

|                    | Fusor                           | React                           |                                   |
| ------------------ | ------------------------------- | ------------------------------- | --------------------------------- |
| Create state       | `let x = 0`                     | `const [x, setX] = useState(0)` |                                   |
| Update state       | `x = 1`                         | `setX(1)`                       |                                   |
| Update DOM         | `update()`                      | `setX(1)`                       | **both** are manual calls         |
| Static prop/child  | `<p id={x}>{y}</p>`             | `<p id={x}>{y}</p>`             | exactly the same                  |
| Dynamic prop/child | `<p id={() => x}>{() => y}</p>` | `<p id={x}>{y}</p>`             | callbacks used for dynamic values |

### Components

```jsx
// This function runs on creation and update, generating a virtual
// DOM object. On update, it reruns all logic & recreates all data
// inside, diffs the whole virtual DOM, and updates the real DOM.
const ReactComponent = ({count: init = 0}) => {
  const [count, setCount] = useState(init);
  const handleClick = useCallback(
    // preserve the first
    () => setCount((count) => count + 1), // function reference to
    [],
  ); // match Fusor's behaviour
  return <button onClick={handleClick}>Clicked {count} times</button>;
};

// This function runs once on creation, generating a DOM element
// and its updater function. On update, only its dynamic values
// are diffed and its DOM node is updated.
const FusorComponent = ({count = 0}) => (
  <button click_e_update={() => count++}>Clicked {() => count} times</button>
);
```

## Other differences

|                        | Fusor             | React             |
| ---------------------- | ----------------- | ----------------- |
| DOM                    | Real              | Virtual           |
| Events                 | Native            | Synthetic         |
| Lifecycle              | Native            | Complex mechanics |
| Attribute names        | W3C Specification | Mangled           |
| Web components support | Complete          | Incomplete        |

## Lifecycle

|            | Fusor   | React                                                                                                |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------- |
| Creating   | create  |                                                                                                      |
| Mounting   | mount   | constructor, getDerivedStateFromProps, render, componentDidMount                                     |
| Updating   | update  | getDerivedStateFromProps, shouldComponentUpdate, render, getSnapshotBeforeUpdate, componentDidUpdate |
| Unmounting | unmount | componentWillUnmount                                                                                 |

<!-- Кстати, у Fusor есть еще несколько киллер-фич, помимо простоты и наглядности, которых нет у других:

Выбор стратегии стейт менеджмента за вами. Можно использовать хоть обычные переменные там где это подойдет (много где подходит).

Возможность обновлять не только изменившееся место в DOM, но и делать это без DIFF всего дерева приложения от ROOT. Можно настраивать стартовые позиции DIFF от конкретных элементов и прерывать DIFF в нужных местах. Например компонент делает DIFF только для себя.

Также есть возможность выбора стратегии создания/обновления/DIFF компонентов. Например мы можем в нужных местах добавить асинхронность для больших списков или очередь.

Возможность применения функционального программирования, так как АПИ это PURE функции, нет контекста и связанных с ним сайд-эффектов (изменение DOM не влияет на это). -->

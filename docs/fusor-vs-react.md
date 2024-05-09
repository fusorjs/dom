# Fusor vs React

## Common features

Fusor was inspired by React, and they both share the same ideas:

- Composable functional components
- One-way data flow
- JSX
- DOM updates only if a value or reference changes
- Updates to the parent component will trigger the necessary updates in its children

## The main difference

The fundamental difference lies in the separation of concerns within the component lifecycle (aka single-responsibility principle in SOLID)

| Component | Fusor                         | React                       |
| --------- | ----------------------------- | --------------------------- |
| Creation  | `let state = 0; Component();` | `useState(0); Component();` |
| Changing  | `state = 1;`                  | `setState(1); Component();` |
| Updating  | `update();`                   | `Component();`              |

> A plain variable is used for Fusor state in the example above.

## Benefits

|                     | Fusor                                           | React                                                       |
| ------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| Component data      | Created **once** on initialization              | Created on initialization and recreated on **every** update |
| Side effects        | Normal JavaScript flow                          | Complex and verbose _hooks_ mechanics                       |
| Component updates   | Explicit/precise, update what and when you need | Implicit, complex, whole tree diffing                       |
| Component functions | Pure                                            | Context is required                                         |
| Library size (gz)   | ~4KiB                                           | ~44KiB                                                      |

## Code samples

|                    | Fusor                           | React                           |                                   |
| ------------------ | ------------------------------- | ------------------------------- | --------------------------------- |
| Create state       | `let x = 0`                     | `const [x, setX] = useState(0)` |                                   |
| Update state       | `x = 1`                         | `setX(1)`                       |                                   |
| Update DOM         | `update()`                      | `setX(1)`                       | **both** are manual calls         |
| Static prop/child  | `<p id={x}>{y}</p>`             | `<p id={x}>{y}</p>`             | exactly the same                  |
| Dynamic prop/child | `<p id={() => x}>{() => y}</p>` | `<p id={x}>{y}</p>`             | callbacks used for dynamic values |

> See also [verbosity analysis](fusor-vs-react-verbosity.jsx)

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

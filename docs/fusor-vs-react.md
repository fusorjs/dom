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

|                    | Fusor     | React                         |
| ------------------ | --------- | ----------------------------- |
| Component creation | create()  | create_update()               |
| Component changing | state = x | setState(x) + create_update() |
| Component updating | update()  | create_update()               |

## Benefits

|                     | Fusor                                   | React                                                       |
| ------------------- | --------------------------------------- | ----------------------------------------------------------- |
| Component data      | Created once on initialization          | Created on initialization and **recreated** on every update |
| Side effects        | Normal JavaScript flow                  | Complex and verbose _hooks_ logic                           |
| Component updates   | Explicit, update what and when you need | Implicit and heavyweight                                    |
| Component functions | Pure                                    | Not pure, React Context is required and mutated             |
| Library size (gz)   | ~2kB                                    | ~44kB                                                       |

## Lifecycle

|            | Fusor   | React                                                                                                |
| ---------- | ------- | ---------------------------------------------------------------------------------------------------- |
| Creating   | create  |                                                                                                      |
| Mounting   | mount   | constructor, getDerivedStateFromProps, render, componentDidMount                                     |
| Updating   | update  | getDerivedStateFromProps, shouldComponentUpdate, render, getSnapshotBeforeUpdate, componentDidUpdate |
| Unmounting | unmount | componentWillUnmount                                                                                 |

## Samples

|                    | Fusor                           | React                           | Comment                           |
| ------------------ | ------------------------------- | ------------------------------- | --------------------------------- |
| Create state       | `let x = 0`                     | `const [x, setX] = useState(0)` |                                   |
| Update state       | `x = 1`                         | `setX(1)`                       |                                   |
| Update DOM         | `update()`                      | `setX(1)`                       | **both** are manual calls         |
| Static prop/child  | `<p id={x}>{y}</p>`             | `<p id={x}>{y}</p>`             | exactly the same                  |
| Dynamic prop/child | `<p id={() => x}>{() => y}</p>` | `<p id={x}>{y}</p>`             | callbacks used for dynamic values |

## Other differences

|                        | Fusor             | React         |
| ---------------------- | ----------------- | ------------- |
| DOM                    | Real              | Virtual       |
| Events                 | Native            | Synthetic     |
| Lifecycle              | Native            | Complex logic |
| Attribute names        | W3C Specification | Mangled       |
| Web components support | Complete          | Incomplete    |

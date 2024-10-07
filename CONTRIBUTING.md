# Contributing

Please check [CHANGELOG](CHANGELOG.md) for agenda.

## Start Developing

```sh
npm install
npm start
```

- **Please Use Prettier!**
- Link `dist` and `package.json` to `your-progect/node_modules/@fusorjs/dom`
- Run tests before contributing

```sh
npm test
npm coverage
```

## Rules

- Avoid adding your custom props to DOM element objects: for data normalization, may degrade performance (mounted elements), may conflict with standard props.
- Reuse given objects and arrays without their recreation nor modification. Avoid arrays flattening, avoid object's `rest`ing or `spread`ing operations.

## Project Philosophy

> "_Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away._" ― Antoine de Saint-Exupéry

- **Simple**, small, **pure**, and **functional** API and implementation.
- Sane defaults, also known as _convention over configuration_.

> _Explicit is better than implicit_ or the _principle of least surprise_.

- **Explicit** API without hidden magic going on behind the scenes.
- **W3C standards** compliant

> "_Simple things should be simple, complex things should be possible_." ― Alan Kay

- **Full control** over DOM creation and updates.
- **Full control** over state, context, lifecycle, diffing, and concurrency.

> "_Do one thing and do it well._"

- Specifically: managing the DOM.

> The other requirements:

- Efficient use of provided and internal data
- **Immutability**, avoid excessive creation

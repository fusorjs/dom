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

## Philosophy

> "_It (Fusor) **fuses** (DOM) **elements** into components._" - me

<!--  -->

> "_What if we take React as a framework and "lift out" key features like state, effects, error handling, concurrency, and server-side functionality? Then, we would get Fusor._" - me

<!-- Если убрать ("Lift Up") из React внутреннюю/скрытую логику: управления стейтом и эффектами, обработки ошибок, управленя параллелизмом, и серверную логику, тогда получится - Fusor. -->

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

<!--
> Fusor is just a helper library for a new way of writing web apps
> Manually triggering updates is better than outsourcing this to some obscure/implicit/slow framework

-->

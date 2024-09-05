# Optimisation

## Cache Components

Do this:

```jsx
import {getElement, update} from '@fusorjs/dom';

const cachedOdd = <span>Odd</span>;
const cachedEven = <span>Even</span>;

let number = 0;

const page = <p>{() => (number % 2 ? cachedOdd : cachedEven)}</p>;

document.body.append(getElement(page));

setInterval(() => {
  number += 1;
  update(page);
}, 1000);
```

Instead of doing this:

```jsx
const page = <p>{() => (number % 2 ? <span>Odd</span> : <span>Even</span>)}</p>;
```

Because `<span>Odd</span>` or `<span>Even</span>` is recreated each second

### Cache In-Place

```jsx
const page = (
  <div>
    {(
      (cache = button('Clear All')) =>
      () =>
        length > 0 && cache
    )()}
  </div>
);
```

Because the relevant information is defined where it is needed.

### Cache and Update In-Place

```tsx
const page = (
  <div>
    {(
      (cache?: Fusion[]) => () =>
        dataLength > 0 &&
        (cache ? cache.map(update) : (cache = [List(), Panel()]))
    )()}
  </div>
);
```

Because the relevant information is defined where it is needed.

## Break Update Recursivity

Do this:

```jsx
const page = (
  <div>
    {(
      (cache = Heavy()) =>
      () =>
        length > 0 && cache
    )()}
  </div>
);
```

Instead of doing this:

```jsx
const page = (
  <div>
    {(
      (cache?: Fusion) =>
      () =>
        length > 0 && (cache ? update(cache) : (cache = Heavy()))
    )()}
  </div>
);
```

Because you want to update heavy objects partially inside them.

## Use Dynamic Props

Do this:

```jsx
import {getElement, update} from '@fusorjs/dom';

const OddOrEven = ({number = () => 0}) => (
  <span>{() => (number() % 2 ? 'odd' : 'even')}</span>
);

let number = 0;

const page = (
  <p>
    <OddOrEven number={() => number} />
  </p>
);

document.body.append(getElement(page));

setInterval(() => {
  number += 1;
  update(page);
}, 1000);
```

Instead of doing this:

```jsx
const OddOrEven = ({number = 0}) => <span>{number % 2 ? 'odd' : 'even'}</span>;

const page = <p>{() => <OddOrEven number={number} />}</p>;
```

Because `<span>...</span>` is recreated each second

## Update Only What and When Necessary

Do this:

```jsx
import {update} from '@fusorjs/dom';

const component1 = <div>{() => dynamicValue}</div>;
const component2 = (
  <div>
    <div>
      <div>
        <div>{component1}</div>
      </div>
    </div>
  </div>
);

update(component1);
```

Instead of doing this:

```jsx
update(component2);
```

Because `update(component2)` is need to go through more layers

## Use Observers to Update Only Parts of the DOM

Do this:

```jsx
import {getRoute, mountRoute} from '../share/route';

export const RouteLink = (title, route) => (
  <a
    href={`#${route}`}
    class={() => (getRoute() === route ? 'selected' : undefined)}
    mount={mountRoute}
  >
    {title}
  </a>
);
```

Instead of doing this:

```jsx
const app = <App getRoute={() => route} />;

onRoute(() => update(app));
```

Because it is better to update only required parts of the DOM instaed of updating the whole application DOM tree

> See [TodoMvc](https://github.com/fusorjs/todomvc) application

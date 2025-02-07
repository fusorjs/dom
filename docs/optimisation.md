# Optimization

## Cache Components

Do this:

```jsx
import {getElement, update} from '@fusorjs/dom';

const cachedOdd = <span>Odd</span>;
const cachedEven = <span>Even</span>;

let count = 0;

const page = <p>{() => (count % 2 ? cachedOdd : cachedEven)}</p>;

document.body.append(getElement(page));

setInterval(() => {
  count += 1;
  update(page);
}, 1000);
```

Instead of doing this:

```jsx
const page = <p>{() => (count % 2 ? <span>Odd</span> : <span>Even</span>)}</p>;
```

Because otherwise, `<span>Odd</span>` or `<span>Even</span>` is recreated each second.

### Cache In-Place

```jsx
let isVisible = true; // can change

const page = (
  <div>
    {(
      (cache = <button>Clear All</button>) =>
      () =>
        isVisible && cache
    )()}
  </div>
);
```

Because the variables are defined in the same place.

### Cache and Update In-Place

```tsx
let isVisible = true; // can change

const page = (
  <div>
    {(
      (cache?: Fusion[]) => () =>
        isVisible &&
        (cache ? cache.map(update) : (cache = [<List />, <Panel />]))
    )()}
  </div>
);
```

First create and cache, then only update.

## Break Update Recursivity

Do this:

```jsx
let isVisible = true; // can change

const page = (
  <div>
    {(
      (cache = <Heavy />) =>
      () =>
        isVisible && cache
    )()}
  </div>
);
```

Instead of doing this:

```tsx
let isVisible = true; // can change

const page = (
  <div>
    {(
      (cache?: Fusion) => () =>
        isVisible && (cache ? update(cache) : (cache = <Heavy />))
    )()}
  </div>
);
```

Because you might not want to update heavy objects as a whole, but control updating inside them.

## Use Dynamic Props

Do this:

```jsx
import {getElement, update} from '@fusorjs/dom';

const OddOrEven = ({count = () => 0}) => (
  <span>{() => (count() % 2 ? 'odd' : 'even')}</span>
);

let count = 0;

const page = (
  <p>
    <OddOrEven count={() => count} />
  </p>
);

document.body.append(getElement(page));

setInterval(() => {
  count += 1;
  update(page);
}, 1000);
```

Instead of doing this:

```jsx
const OddOrEven = ({count = 0}) => <span>{count % 2 ? 'odd' : 'even'}</span>;

const page = <p>{() => <OddOrEven count={count} />}</p>;
```

Because otherwise, `<span>...</span>` is recreated each second

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

## Use Observer Pattern to Update Only Parts of the DOM

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

# Optimisation

## Cache components

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

## Use dynamic props

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

## Update only what and when necessary

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

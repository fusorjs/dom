# Fusor vs React Verbosity

- Verbosity - number of characters without whitespace
- Tool to calculate the verbosity <https://techwelkin.com/tools/letter-count-character-count/>
- Imports are not included
- Fusor FN - [functional notation](functional-notation.md)
- Idiomatic code is written with the same variable names where posible
- Prettier is used to format the code

## Click Counting Component

```jsx
// React
// Verbosity: 152
const ClickCounter = ({count: init = 0}) => {
  const [count, setCount] = useState(init);
  return (
    <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
  );
};

// React
// Verbosity: 204
// useCallback is used here to match Fusor's behavior because it doesn't recreate the function (reference)
const ClickCounter = ({count: init = 0}) => {
  const [count, setCount] = useState(init);
  const handleClick = useCallback(() => setCount((count) => count + 1), []);
  return <button onClick={handleClick}>Clicked {count} times</button>;
};

// Fusor JSX
// Verbosity: 102
const ClickCounter = ({count = 0}) => (
  <button click_e_update={() => count++}>Clicked {() => count} times</button>
);

// Fusor FN
// Verbosity: 96
const ClickCounter = ({count = 0}) =>
  button({click_e_update: () => count++}, 'Clicked ', () => count, ' times');
```

## Analog Clock Component

```jsx
// React
// Verbosity: 498
const AnalogClock = () => {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const timerId = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  return (
    <svg viewBox="-50 -50 100 100">
      <circle className="face" r="48" />
      <line
        className="hour"
        transform={`rotate(${
          30 * (date.getHours() % 12) + date.getMinutes() / 2
        })`}
        y2="-25"
      />
      <line
        className="minute"
        transform={`rotate(${6 * date.getMinutes()})`}
        y2="-35"
      />
      <line
        className="second"
        transform={`rotate(${6 * date.getSeconds()})`}
        y2="-35"
      />
    </svg>
  );
};

// Fusor JSX
// Verbosity: 484
const AnalogClock = ({date = new Date()} = {}) => (
  <div
    mount={(self) => {
      const timerId = setInterval(() => {
        date = new Date();
        update(self);
      }, 1000);
      return () => clearInterval(timerId);
    }}
  >
    <svg viewBox="-50 -50 100 100">
      <circle class="face" r="48" />
      <line
        class="hour"
        transform={() =>
          `rotate(${30 * (date.getHours() % 12) + date.getMinutes() / 2})`
        }
        y2="-25"
      />
      <line
        class="minute"
        transform={() => `rotate(${6 * date.getMinutes()})`}
        y2="-35"
      />
      <line
        class="second"
        transform={() => `rotate(${6 * date.getSeconds()})`}
        y2="-35"
      />
    </svg>
  </div>
);

// Fusor FN
// Verbosity: 488
const AnalogClock = ({date = new Date()} = {}) =>
  div(
    {
      mount: (self) => {
        const timerId = setInterval(() => {
          date = new Date();
          update(self);
        }, 1000);
        return () => clearInterval(timerId);
      },
    },
    svg(
      {viewBox: '-50 -50 100 100'},
      circle({class: 'face', r: '48'}),
      line({
        class: 'hour',
        transform: () =>
          `rotate(${30 * (date.getHours() % 12) + date.getMinutes() / 2})`,
        y2: '-25',
      }),
      line({
        class: 'minute',
        transform: () => `rotate(${6 * date.getMinutes()})`,
        y2: '-35',
      }),
      line({
        class: 'second',
        transform: () => `rotate(${6 * date.getSeconds()})`,
        y2: '-35',
      }),
    ),
  );
```

## Request Users Page

<!-- todo optimize & update the code: -->

```jsx
// React - lines: 59
// Verbosity: 1182
// () => abortRef.current?.abort() - will update setData or setError
const RequestUsers = () => {
  const [data, setData] = useState();
  const [error, setError] = useState();
  const abortRef = useRef();
  const getUsers = useCallback(async () => {
    try {
      setData(undefined);
      setError(undefined);
      abortRef.current = new AbortController();
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {signal: abortRef.current.signal},
      );
      setData(await response.json());
    } catch (e) {
      setError(e);
    } finally {
      abortRef.current = undefined;
    }
  }, []);
  useEffect(() => () => abortRef.current?.abort(), []);
  return (
    <section>
      <p>
        This is a proper way to do api requests. Using loading state, borting
        and handling errors.
      </p>
      <div>
        <button disabled={abortRef.current !== undefined} onClick={getUsers}>
          Request users
        </button>
        <button
          disabled={abortRef.current === undefined}
          onClick={() => abortRef.current?.abort()}
        >
          Abort
        </button>
      </div>
      <div>
        {abortRef.current && <p>Loading...</p>}
        {error && <p className="error">Error: {error?.message || error}</p>}
        {data && (
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>User</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
              <tbody>{data.map((i) => UserRow(i))}</tbody>
            </thead>
          </table>
        )}
      </div>
    </section>
  );
};
const UserRow = ({id, username, name, email}) => (
  <tr>
    <td>{id}</td>
    <td>{username}</td>
    <td>{name}</td>
    <td>
      <a href={'mailto:' + email}>{email}</a>
    </td>
  </tr>
);

// Fusor JSX
// Verbosity: 1073
const RequestUsers = () => {
  let data;
  let error;
  let abort;
  const getUsers = async () => {
    try {
      data = undefined;
      error = undefined;
      abort = new AbortController();
      wrapper.update();
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {signal: abort.signal},
      );
      data = await response.json();
    } catch (e) {
      error = e;
    } finally {
      abort = undefined;
      wrapper.update();
    }
  };
  const wrapper = (
    <section mount={() => () => abort?.abort()}>
      <p>
        This is a proper way to do api requests. Using loading state, aborting
        and handling errors.
      </p>
      <div>
        <button disabled={() => abort !== undefined} click_e={getUsers}>
          Request users
        </button>
        <button
          disabled={() => abort === undefined}
          click_e={() => abort?.abort()}
        >
          Abort
        </button>
      </div>
      <div>
        {() => abort && <p>Loading...</p>}
        {() => error && <p class="error">Error: {error?.message || error}</p>}
        {() =>
          data && (
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>User</th>
                  <th>Name</th>
                  <th>Email</th>
                </tr>
                <tbody>
                  {data.map((i) => (
                    <UserRow {...i} />
                  ))}
                </tbody>
              </thead>
            </table>
          )
        }
      </div>
    </section>
  );
  return wrapper;
};
const UserRow = ({id, username, name, email}) => (
  <tr>
    <td>{id}</td>
    <td>{username}</td>
    <td>{name}</td>
    <td>
      <a href={'mailto:' + email}>{email}</a>
    </td>
  </tr>
);

// Fusor FN
// Verbosity: 954
const RequestUsers = () => {
  let data;
  let error;
  let abort;
  const getUsers = async () => {
    try {
      data = undefined;
      error = undefined;
      abort = new AbortController();
      wrapper.update();
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {signal: abort.signal},
      );
      data = await response.json();
    } catch (e) {
      error = e;
    } finally {
      abort = undefined;
      wrapper.update();
    }
  };
  const wrapper = section(
    {mount: () => () => abort?.abort()},
    p(
      'This is a proper way to do api requests. Using loading state, aborting and handling errors.',
    ),
    div(
      button('Request users', {
        disabled: () => abort !== undefined,
        click_e: getUsers,
      }),
      button('Abort', {
        disabled: () => abort === undefined,
        click_e: () => abort?.abort(),
      }),
    ),
    div(
      () => abort && p('Loading...'),
      () => error && p('Error: ', error?.message || error, {class: 'error'}),
      () =>
        data &&
        table(
          thead(tr(th('Id'), th('User'), th('Name'), th('Email'))),
          tbody(data.map((i) => UserRow(i))),
        ),
    ),
  );
  return wrapper;
};
const UserRow = ({id, username, name, email}) =>
  tr(td(id), td(username), td(name), td(a(email, {href: 'mailto:' + email})));
```

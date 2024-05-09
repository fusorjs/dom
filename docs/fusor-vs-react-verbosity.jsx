// Fusor vs React component verbosity analysis
// Verbosity - number of symbols without whitespace <https://techwelkin.com/tools/letter-count-character-count/>
// Prettier - "printWidth": 800

// * CountingButton
{
  // React - lines: 4, verbosity: 135
  {
    const CountingButton = () => {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
    };
  }

  // React (feature parity with Fusor) - lines: 5, verbosity: 189
  {
    const CountingButton = () => {
      const [count, setCount] = useState(0);
      const handleClick = useCallback(() => setCount((count) => count + 1), []);
      return <button onClick={handleClick}>Clicked {count} times</button>;
    };
  }

  // Fusor JSX - lines: 4, verbosity: 116
  {
    const CountingButton = () => {
      let count = 0;
      return <button click_e_update={() => (count += 1)}>Clicked {() => count} times</button>;
    };
  }

  // Fusor FN - lines: 4, verbosity: 113
  {
    const CountingButton = () => {
      let count = 0;
      return button({click_e_update: () => (count += 1)}, 'Clicked ', () => count, ' times.');
    };
  }
}

// * AnalogClock
{
  // React - lines: 25, verbosity: 783
  {
    const createDegrees = () => {
      const d = new Date();
      return {
        secondsDegree: 6 * d.getSeconds(),
        minutesDegree: 6 * d.getMinutes(),
        hoursDegree: 30 * (d.getHours() % 12) + d.getMinutes() / 2,
      };
    };
    const AnalogClock = () => {
      const [{secondsDegree, minutesDegree, hoursDegree}, setDegrees] = useState(createDegrees);
      useEffect(() => {
        const timerId = setInterval(() => setDegrees(createDegrees()), 1000);
        return () => clearInterval(timerId);
      }, []);
      return (
        <svg viewBox="0 0 100 100">
          <circle class="face" cx="50" cy="50" r="45" />
          <g>
            <rect class="hour" x="47.5" y="12.5" width="5" height="40" rx="2.5" ry="2.55" transform={`rotate(${hoursDegree} 50 50)`} />
            <rect class="min" x="48.5" y="12.5" width="3" height="40" rx="2" ry="2" transform={`rotate(${minutesDegree} 50 50)`} />
            <line class="sec" x1="50" y1="50" x2="50" y2="16" transform={`rotate(${secondsDegree} 50 50)`} />
          </g>
        </svg>
      );
    };
  }

  // Fusor JSX - lines: 30, verbosity: 776
  {
    const AnalogClock = () => {
      let secondsDegree, minutesDegree, hoursDegree;
      const updateDegrees = () => {
        const d = new Date();
        secondsDegree = 6 * d.getSeconds();
        minutesDegree = 6 * d.getMinutes();
        hoursDegree = 30 * (d.getHours() % 12) + d.getMinutes() / 2;
      };
      updateDegrees();
      return (
        <div
          mount={(self) => {
            const timerId = setInterval(() => {
              updateDegrees();
              self.update();
            }, 1000);
            return () => clearInterval(timerId);
          }}
        >
          <svg viewBox="0 0 100 100">
            <circle class="face" cx="50" cy="50" r="45" />
            <g>
              <rect class="hour" x="47.5" y="12.5" width="5" height="40" rx="2.5" ry="2.55" transform={() => `rotate(${hoursDegree} 50 50)`} />
              <rect class="min" x="48.5" y="12.5" width="3" height="40" rx="2" ry="2" transform={() => `rotate(${minutesDegree} 50 50)`} />
              <line class="sec" x1="50" y1="50" x2="50" y2="16" transform={() => `rotate(${secondsDegree} 50 50)`} />
            </g>
          </svg>
        </div>
      );
    };
  }

  // Fusor FN - lines: 22, verbosity: 785
  {
    const AnalogClock = () => {
      let secondsDegree, minutesDegree, hoursDegree;
      const updateDegrees = () => {
        const d = new Date();
        secondsDegree = 6 * d.getSeconds();
        minutesDegree = 6 * d.getMinutes();
        hoursDegree = 30 * (d.getHours() % 12) + d.getMinutes() / 2;
      };
      updateDegrees();
      return div(
        {
          mount: (self) => {
            const timerId = setInterval(() => {
              updateDegrees();
              self.update();
            }, 1000);
            return () => clearInterval(timerId);
          },
        },
        svg({viewBox: '0 0 100 100'}, circle({class: 'face', cx: '50', cy: '50', r: '45'}), g(rect({class: 'hour', x: '47.5', y: '12.5', width: '5', height: '40', rx: '2.5', ry: '2.55', transform: () => `rotate(${hoursDegree} 50 50)`}), rect({class: 'min', x: '48.5', y: '12.5', width: '3', height: '40', rx: '2', ry: '2', transform: () => `rotate(${minutesDegree} 50 50)`}), line({class: 'sec', x1: '50', y1: '50', x2: '50', y2: '16', transform: () => `rotate(${secondsDegree} 50 50)`}))),
      );
    };
  }
}

// * RequestUsers
{
  // React - lines: 59, verbosity: 1181
  // () => abortRef.current?.abort() - will update setData or setError
  {
    const RequestUsers = () => {
      const [data, setData] = useState();
      const [error, setError] = useState();
      const abortRef = useRef();
      const getUsers = useCallback(async () => {
        try {
          setData(undefined);
          setError(undefined);
          abortRef.current = new AbortController();
          const response = await fetch('https://jsonplaceholder.typicode.com/users', {signal: abortRef.current.signal});
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
          <p>This is a proper way to do api requests. Using loading state, aborting and handling errors.</p>
          <div>
            <button disabled={abortRef.current !== undefined} onClick={getUsers}>
              Request users
            </button>
            <button disabled={abortRef.current === undefined} onClick={() => abortRef.current?.abort()}>
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
  }

  // Fusor JSX - lines: 67, verbosity: 1072
  {
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
          const response = await fetch('https://jsonplaceholder.typicode.com/users', {signal: abort.signal});
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
          <p>This is a proper way to do api requests. Using loading state, aborting and handling errors.</p>
          <div>
            <button disabled={() => abort !== undefined} click_e={getUsers}>
              Request users
            </button>
            <button disabled={() => abort === undefined} click_e={() => abort?.abort()}>
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
  }

  // Fusor FN - lines: 41, verbosity: 948
  {
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
          const response = await fetch('https://jsonplaceholder.typicode.com/users', {signal: abort.signal});
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
        p('This is a proper way to do api requests. Using loading state, aborting and handling errors.'),
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
          () => data && table(thead(tr(th('Id'), th('User'), th('Name'), th('Email'))), tbody(data.map((i) => UserRow(i)))),
        ),
      );
      return wrapper;
    };
    const UserRow = ({id, username, name, email}) => tr(td(id), td(username), td(name), td(a(email, {href: 'mailto:' + email})));
  }
}

// * New
{
  // React - lines: , verbosity:
  {
    //
  }

  // Fusor JSX - lines: , verbosity:
  {
    //
  }

  // Fusor FN - lines: , verbosity:
  {
    //
  }
}

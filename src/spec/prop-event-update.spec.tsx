import {Component, jsx} from '..';

test.each(
  // prettier-ignore
  [
    [<button click$e={() => {}} />                        , HTMLButtonElement],
    [<button click$e$update={() => {}} />                 , HTMLButtonElement],
    [<button click$e={{handle: () => {}}} />              , HTMLButtonElement],
    [<button click$e={{update: true, handle: () => {}}} />, HTMLButtonElement],
  ],
)('must not create component', (value, _class) => {
  expect(value).toBeInstanceOf(_class);
});

test.each([
  [
    () => {
      let count = 0;
      return (
        <button click$e={() => (count += 1)}>
          Clicked {() => count} times
        </button>
      );
    },
    'Clicked 0 times', // ! zero
  ],
  [
    () => {
      let count = 0;
      return (
        <button click$e$update={() => (count += 1)}>
          Clicked {() => count} times
        </button>
      );
    },
    'Clicked 1 times',
  ],
  [
    () => {
      let count = 0;
      return (
        <button
          click$e={{
            handle: () => (count += 1),
            update: true,
          }}
        >
          Clicked {() => count} times
        </button>
      );
    },
    'Clicked 1 times',
  ],
  [
    () => {
      let count = 0;
      return (
        <button
          click$e={{
            handle: {handleEvent: () => (count += 1)},
            update: true,
          }}
        >
          Clicked {() => count} times
        </button>
      );
    },
    'Clicked 1 times',
  ],
])('count times clicked', (CountingButton, text) => {
  const {element} = (<CountingButton />) as Component<Element>;
  expect(element.innerHTML).toBe('Clicked 0 times');
  element.dispatchEvent(new Event('click'));
  expect(element.innerHTML).toBe(text);
});

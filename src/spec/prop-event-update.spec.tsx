import {getElement, jsx} from '..';

test.each(
  // prettier-ignore
  [
    [<button click_e={() => {}} />                        , HTMLButtonElement],
    [<button click_e_update={() => {}} />                 , HTMLButtonElement],
    [<button click_e={{handle: () => {}}} />              , HTMLButtonElement],
    [<button click_e={{update: true, handle: () => {}}} />, HTMLButtonElement],
  ],
)('must not create component', (value, _class) => {
  expect(value).toBeInstanceOf(_class);
});

test.each([
  [
    'without update',
    () => {
      let count = 0;
      return (
        <button click_e={() => (count += 1)}>
          Clicked {() => count} times
        </button>
      );
    },
    'Clicked 0 times', // ! zero
  ],
  [
    'click_e_update',
    () => {
      let count = 0;
      return (
        <button click_e_update={() => (count += 1)}>
          Clicked {() => count} times
        </button>
      );
    },
    'Clicked 1 times',
  ],
  [
    'options: {handle, update}',
    () => {
      let count = 0;
      return (
        <button
          click_e={{
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
    'options: {handle: {handleEvent}, update}',
    () => {
      let count = 0;
      return (
        <button
          click_e={{
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
])('count times clicked: %s', (description, CountingButton, text) => {
  const element = getElement(<CountingButton />);
  expect(element.innerHTML).toBe('Clicked 0 times');
  element.dispatchEvent(new Event('click'));
  expect(element.innerHTML).toBe(text);
});

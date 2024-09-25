import {Component, Fusion, jsx, update} from '..';

test('static mount/unmount', () => {
  let result = '';
  const wrapper = (
    <div
      mount={() => {
        result = 'Yay mounted!';

        return () => (result = 'Yay unmounted!');
      }}
    >
      Hello!
    </div>
  ) as Element;

  expect(wrapper).toBeInstanceOf(HTMLDivElement);
  expect(result).toBe('');
  document.body.append(wrapper);
  expect(document.body.innerHTML).toBe(
    '<div is="fusorjs-life-div">Hello!</div>',
  );
  expect(result).toBe('Yay mounted!');
  document.body.removeChild(wrapper);
  expect(result).toBe('Yay unmounted!');
});

test('dynamic mount/unmount', () => {
  let content = 'Hello';
  const wrapper = (
    <div
      mount={(self: Fusion) => {
        content += ' World';
        update(self);

        return () => {
          content = 'End';
          update(self);
        };
      }}
    >
      {() => content}
    </div>
  ) as Component<Element>;

  expect(wrapper).toBeInstanceOf(Component);
  expect(wrapper.element.outerHTML).toBe(
    '<div is="fusorjs-life-div">Hello</div>',
  );
  document.body.append(wrapper.element);
  expect(document.body.innerHTML).toBe(
    '<div is="fusorjs-life-div">Hello World</div>',
  );
  document.body.removeChild(wrapper.element);
  expect(wrapper.element.outerHTML).toBe(
    '<div is="fusorjs-life-div">End</div>',
  );
});

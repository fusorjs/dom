import {Component, jsx} from '..';

test('static mount/unmount', () => {
  const logSpy = jest.spyOn(console, 'log');
  const wrapper = (
    <div
      mount={() => {
        console.log('Yay mounted!');

        return () => console.log('Yay unmounted!');
      }}
    >
      Hello!
    </div>
  ) as Element;

  expect(wrapper).toBeInstanceOf(HTMLDivElement);
  expect(logSpy).not.toHaveBeenCalled();
  document.body.append(wrapper);
  expect(document.body.innerHTML).toBe(
    '<div is="fusorjs-life-div">Hello!</div>',
  );
  expect(logSpy).toHaveBeenCalledWith('Yay mounted!');
  document.body.removeChild(wrapper);
  expect(logSpy).toHaveBeenCalledWith('Yay unmounted!');
});

test('dynamic mount/unmount', () => {
  let content = 'Hello';
  const wrapper = (
    <div
      mount={(self) => {
        content += ' World';
        self.update();

        return () => {
          content = 'End';
          self.update();
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

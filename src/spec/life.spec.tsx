import {Fusion, getElement, jsx, update} from '..';
import {Component} from '../component';

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
  );
  const element = getElement(wrapper);

  expect(wrapper).toBeInstanceOf(Component);
  expect(element.outerHTML).toBe('<div is="fusorjs-life-div">Hello</div>');
  document.body.append(element);
  expect(document.body.innerHTML).toBe(
    '<div is="fusorjs-life-div">Hello World</div>',
  );
  document.body.removeChild(element);
  expect(element.outerHTML).toBe('<div is="fusorjs-life-div">End</div>');
});

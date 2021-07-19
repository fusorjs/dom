import {initProps} from './init';

test('set color style of text', () => {
  const buttonElement = document.createElement('button');

  initProps(buttonElement, {
    style: 'color:red',
    disabled: true,
  });

  expect(
    buttonElement.outerHTML
  ).toBe(
    '<button style="color:red" disabled=""></button>' // todo just disabled
  );
});

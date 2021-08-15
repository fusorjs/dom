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

describe('boolean', () => {
  describe('init', () => {
    test('true', () => {
      const buttonElement = document.createElement('button');

      expect(
        buttonElement.disabled
      ).toStrictEqual(
        false
      );

      initProps(buttonElement, {
        disabled: true,
      });

      expect(
        buttonElement.disabled
      ).toStrictEqual(
        true
      );
    });

    const testInitProp = (propName: string, initialValue: any, expectedValue: boolean) => {
      const buttonElement = document.createElement('button');

      initProps(buttonElement, {
        [propName]: initialValue,
      });

      expect(
        buttonElement.disabled
      ).toStrictEqual(
        expectedValue
      );

      expect(
        buttonElement.outerHTML
      ).toBe(
        expectedValue
        ? '<button disabled=""></button>' // todo just disabled
        : '<button></button>'
      );
    };

    test.each([
      ['disabled', '', false],
      ['disabled', null, false],
      ['disabled', undefined, false],
      ['disabled', false, false],
      ['disabled', true, true],
      // ['disabled', 0, true],
    ])('init %s %p %p', testInitProp);

  });
});


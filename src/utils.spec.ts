import {getValue} from './utils';

describe('getValue', ()  => {

  test.each([
    [() => 1, 1],
    [() => () => 2, 2],
    [() => () => () => 3, 3],
    [() => () => () => () => 4, 4],
    [() => () => () => () => () => 5, 5],
  ])('%p toBe %p', (provided: any, expected: any) => {
    expect(getValue(provided)).toBe(expected);
  });

  test('exception', () => {
    expect(() => {
      getValue(() => () => () => () => () => () => 6)
    }).toThrow(
      new TypeError(`preventing indefinite callback: 6`)
    );
  });

});

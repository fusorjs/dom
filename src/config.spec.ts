import {getPropConfig$$} from './config';
import {PropType} from './types';

describe('get prop config $$', () => {
  test.each([
    ['on$$', new TypeError(`short capturing event name: "on$$"`)],
    ['$$', new TypeError(`short property name: "$$"`)],
    ['on', new TypeError(`short bubbling event name: "on"`)],
    ['', new TypeError(`short attribute name: ""`)],
  ])('provided %p expected %p', (provided, expected) => {
    expect(() => {
      getPropConfig$$(provided);
    }).toThrow(expected);
  });

  test.each([
    ['onclick$$', {type: PropType.CAPTURING_EVENT, key: 'click'}],
    ['onclick', {type: PropType.BUBBLING_EVENT, key: 'click'}],
    ['one$$', {type: PropType.CAPTURING_EVENT, key: 'e'}],
    ['one', {type: PropType.BUBBLING_EVENT, key: 'e'}],
    ['href$$', {type: PropType.PROPERTY, key: 'href'}],
    ['href', {type: PropType.ATTRIBUTE, key: 'href'}],
    ['id$$', {type: PropType.PROPERTY, key: 'id'}],
    ['id', {type: PropType.ATTRIBUTE, key: 'id'}],
    ['a$$', {type: PropType.PROPERTY, key: 'a'}],
    ['a', {type: PropType.ATTRIBUTE, key: 'a'}],
    ['class$$', {type: PropType.PROPERTY, key: 'className'}],
  ])('provided %p expected %p', (provided, expected) => {
    expect(getPropConfig$$(provided)).toStrictEqual(expected);
  });
});

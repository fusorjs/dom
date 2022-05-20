import {getPropConfig} from './config';
import {PropType} from './types';

describe('get prop config', () => {
  test.each(
    ['', 'a', '$'].map(
      i =>
        [
          i,
          new TypeError(
            `property name length is less than 2 characters: name "${i}"`,
          ),
        ] as const,
    ),
  )('provided %p expected %p', (provided, expected) => {
    expect(() => {
      getPropConfig(provided);
    }).toThrow(expected);
  });

  test.each([
    ['$onclick', {type: PropType.CAPTURING_EVENT, key: 'click'}],
    ['onclick', {type: PropType.BUBBLING_EVENT, key: 'click'}],
    ['$href', {type: PropType.PROPERTY, key: 'href'}],
    ['href', {type: PropType.ATTRIBUTE, key: 'href'}],
    ['id', {type: PropType.ATTRIBUTE, key: 'id'}],
    ['$class', {type: PropType.PROPERTY, key: 'className'}],
  ])('provided %p expected %p', (provided, expected) => {
    expect(getPropConfig(provided)).toStrictEqual(expected);
  });
});

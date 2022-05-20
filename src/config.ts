import {GetPropConfig, PropType} from './types';
import {DEBUG} from './utils';

export const getPropConfig: GetPropConfig = key => {
  if (DEBUG && key.length < 2) {
    throw new TypeError(
      `property name length is less than 2 characters: name "${key}"`,
    );
  }

  if (key[0] === '$') {
    key = key.substring(1);

    if (key.startsWith('on')) {
      return {type: PropType.CAPTURING_EVENT, key: key.substring(2)};
    }

    return {type: PropType.PROPERTY, key: key === 'class' ? 'className' : key};
  }

  if (key.startsWith('on')) {
    return {type: PropType.BUBBLING_EVENT, key: key.substring(2)};
  }

  return {type: PropType.ATTRIBUTE, key};
};

import {Config, GetPropConfig, PropType} from './types';

/** $$ - to stand out and distinguish from template literals
 * @deprecated used in Fusor version 1
 * attribute
 * property$$
 * onbubblingevent
 * oncapturingevent$$
 */
export const getPropConfig$$: GetPropConfig = name => {
  const {length} = name;

  if (name[length - 2] === '$' && name[length - 1] === '$') {
    name = name.substring(0, length - 2);

    if (name.startsWith('on')) {
      if (length < 5)
        throw new TypeError(`short capturing event name: "${name}$$"`);

      return {type: PropType.CAPTURING_EVENT, key: name.substring(2)};
    }

    if (length < 3) throw new TypeError(`short property name: "${name}$$"`);

    return {
      type: PropType.PROPERTY,
      key: name === 'class' ? 'className' : name,
    };
  }

  if (name.startsWith('on')) {
    if (length < 3) throw new TypeError(`short bubbling event name: "${name}"`);

    return {type: PropType.BUBBLING_EVENT, key: name.substring(2)};
  }

  if (length < 1) throw new TypeError(`short attribute name: "${name}"`);

  return {type: PropType.ATTRIBUTE, key: name};
};

// todo onClickCapture

// convert attrs to props:
// html: value, checked, selected
// react: defaultValue, defaultChecked

// <input type="text" />      value="string"        onChange  event.target.value
// <input type="checkbox" />  checked={boolean}     onChange  event.target.checked
// <input type="radio" />     checked={boolean}     onChange  event.target.checked
// <textarea />               value="string"        onChange  event.target.value
// <select />                 value="option value"  onChange  event.target.value

// export const config = {
//   defineProp: getPropConfig$$,
//   evaluateRecursionLimit: 5,
//   updateRecursionLimit: 5, // RECURSION_LIMIT;
// } as const;

export let defaultConfig: Config = {
  getPropConfig: getPropConfig$$,
} as const;

export const setDefaultConfig = (c: Config) => (defaultConfig = c);

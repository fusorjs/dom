import {Props, stringify} from '@perform/common';

// todo pure inline
const getValue = (callback: Function, recursed = 1): any => {
  const value = callback();

  if (typeof value === 'function') {
    if (recursed === 5) throw new TypeError(`preventing indefinite recursion: ${recursed + 1}`);
    return getValue(value, recursed + 1);
  }

  return value;
};

const createUpdater = (element: Element, key: string, callback: Function) => {
  let prevValue: any;

  // init
  prevValue = getValue(callback);
  element[key as 'id'] = prevValue;

  return () => {
    // update
    const nextValue = getValue(callback);

    if (prevValue === nextValue) return;

    prevValue = nextValue;
    element[key as 'id'] = nextValue;
  };
};

export const initProps = (element: Element, attributes: Readonly<Props>) => {
  let updaters;

  for (const [key, val] of Object.entries(attributes)) {
    if (key.startsWith('on')) { // event listeners are staic - do not have updaters
      if (typeof val === 'function') element.addEventListener(key.substring(2), val, false);
      else throw new TypeError(`illegal property: "${key}" = ${stringify(val)}; expected function`);
    }
    // todo data-
    // todo style...
    // todo area-
    else if (key === 'ref') { // ? deprecate
      switch (typeof val) {
        case 'function': val(element); break;
        case 'object': val.current = element; break; // ? deprecate
        default: throw new TypeError(
          `illegal property: "${key}" = ${stringify(val)}; expected function or object`
        );
      }
    }
    else {
      const _key =
        key === 'class' ? 'className' :
        key === 'for'   ? 'htmlFor'   :
        key;

      if (typeof val === 'function') {
        updaters ??= [];
        updaters.push(createUpdater(element, _key, val));
      }
      else element[_key as 'id'] = val;
    }
  }

  return updaters;
};

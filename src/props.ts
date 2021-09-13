import {Prop, Props, stringify} from '@perform/common';

import {evaluate} from './utils';

const createUpdater = (element: Element, key: string, callback: Function) => {
  // init
  let prevValue: Prop;

  // update
  return () => {
    const nextValue = evaluate(callback);

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

import {stringify, Evaluable, evaluate} from '@perform/common';

import {Prop, Props, elementSymbol} from './types';

// todo class
const createUpdater = (element: Element, key: string, callback: Evaluable<Prop>) => {
  // init

  let prevValue = evaluate(callback);

  element[key as 'id'] = prevValue as string;

  // update
  return () => {
    const nextValue = evaluate(callback);

    if (prevValue === nextValue) return;

    prevValue = nextValue;

    element[key as 'id'] = nextValue as string;
  };
};

export const initProps = (element: Element, attributes: Readonly<Props>) => {
  let updaters;

  for (const [key, val] of Object.entries(attributes)) {
    if (typeof val === 'function' && elementSymbol in val) {
      throw new TypeError(`element cannot be a property value "${key}" = ${stringify(val)}`);
    }
    else if (key.startsWith('on')) { // event listeners are staic - do not have updaters
      if (typeof val === 'function') element.addEventListener(key.substring(2), val as any, false);
      else throw new TypeError(`illegal property: "${key}" = ${stringify(val)}; expected function`);
    }
    // todo data-
    // todo style...
    // todo area-

    // ! ref deprecated
    // ! as you should get the reference by simply calling the function
    // ! this leads to better component separation
    // else if (key === 'ref') {
    //   switch (typeof val) {
    //     case 'function': val(element); break;
    //     case 'object': (val as any).current = element; break;
    //     default: throw new TypeError(
    //       `illegal property: "${key}" = ${stringify(val)}; expected function or object`
    //     );
    //   }
    // }

    // todo tests
    // else if (key === 'init') {
    //   if (typeof val === 'function') {
    //     val(element);
    //   }
    //   else {
    //     throw new TypeError(
    //       `illegal property: "${key}" = ${stringify(val)}; expected function`
    //     );
    //   }
    // }

    else {
      const _key =
        key === 'class' ? 'className' :
        // key === 'for'   ? 'htmlFor'   : // ! deprecated as it for html only, not svg
        key;

      if (typeof val === 'function') {
        updaters ??= [];
        updaters.push(createUpdater(element, _key, val as Evaluable<Prop>));
      }
      else element[_key as 'id'] = val as string;
    }
  }

  return updaters;
};

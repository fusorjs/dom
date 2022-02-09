import {stringify, Evaluable, evaluate} from '@perform/common';

import {Prop, Updater} from './types';

// todo class
const createUpdater = (
  element: Element,
  key: string,
  callback: Evaluable<Prop>,
): Updater => {
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

export const initProp = (element: Element, key: string, value: Prop) => {
  if (key.startsWith('on')) {
    // event listeners are staic - do not have updaters

    if (typeof value !== 'function')
      throw new TypeError(
        `illegal property: "${key}" = ${stringify(value)}; expected function`,
      );

    element.addEventListener(key.substring(2), value as EventListener, false);
  }
  // todo data-
  // todo style...
  // todo area-
  // todo classList - init

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
    // todo check types
    // if (typeof value === 'function' && elementSymbol in value) {
    //   throw new TypeError(`element cannot be a property value "${key}" = ${stringify(value)}`);
    // }

    const _key =
      key === 'class'
        ? 'className'
        : // key === 'for'   ? 'htmlFor'   : // ! deprecated as it for html only, not svg
          key;

    if (typeof value === 'function')
      return createUpdater(element, _key, value as Evaluable<Prop>);

    element[_key as 'id'] = value as string;
  }
};

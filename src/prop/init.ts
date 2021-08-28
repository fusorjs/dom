import {Props, isFunction, isEmptyProp, isObject, isLiteral, stringify} from '@perform/common';

type Key = string;
type Value = any;
type GoodValue = string | number | boolean | undefined | null;

const getValue = (f: () => Value, recursed = 0): GoodValue => {
  const value = f();
  const type = typeof value;

  switch (type) {
    case 'number':
      if (value === NaN) throw new Error(`invalid attribute value: ${value}`);
    // case 'string':
    // case 'boolean':
      break;
    case 'function':
      if (recursed === 5) throw new Error(`preventing indefinite recursion: ${recursed}`);
      return getValue(value, recursed + 1);
    // default:
    //   throw new Error(`illegal property: ${value}`);
  }

  return value;
};

const createUpdater = (element: HTMLElement, key: Key, callback: () => Value) => {
  let prevValue: GoodValue;
  let prevEmpty: boolean;

  // init
  prevValue = getValue(callback);

  if (isEmptyProp(prevValue)) prevEmpty = true;
  else element[key as 'id'] = prevValue as string; // todo cast

  return () => {
    // update
    const nextValue = getValue(callback);

    if (prevValue === nextValue) return;

    prevValue = nextValue;

    const nextEmpty = isEmptyProp(nextValue);

    if (nextEmpty && prevEmpty) return;

    prevEmpty = nextEmpty;

    element[key as 'id'] = nextValue as string; // todo cast
  };
};

export const initProps = (element: HTMLElement, attributes: Readonly<Props>) => {
  let updaters;

  for (const [k, v] of Object.entries(attributes)) {
    if (isEmptyProp(v)) { // before: function as null, object as null
      // Do nothing, I love that! :)
    }
    else if (k.startsWith('on')) {
      if (isFunction(v)) element.addEventListener(k.substring(2), v, false);
      else throw new TypeError(`illegal property: "${k}" = ${stringify(v)}; expected function`);
    }
    // todo data-
    // todo style...
    // todo area-
    else if (k === 'ref') {
      if (isFunction(v)) v(element);
      else if (isObject(v)) v.current = element;
      else throw new TypeError(`illegal property: "${k}" = ${stringify(v)}; expected function or object`);
    }
    else {
      const kk = k === 'class' ? 'className' : k;

      if (isLiteral(v) || v === true) {
        // ? maybe in development check for correct attribute key=value
        element[kk as 'id'] = v;
      }
      else if (isFunction(v)) {
        updaters ??= [];
        updaters.push(createUpdater(element, kk, v));
      }
      else throw new TypeError(`illegal property: "${k}" = ${stringify(v)}`);
    }
  }

  return updaters;
};

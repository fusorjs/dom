import {isFunction, isEmpty, isObject, isVoid} from '../../utils';

const createAttributeActionGetter = (textual, numeric, boolean) => (k, v, vT) => {
  switch (vT) {
    case 'string': return textual;
    case 'number': return numeric;
    case 'boolean': return boolean;
    default: throw new Error(`unsupported prop: "${k}" type: ${v}`);
  }
};

const getAttributeSetterAction = createAttributeActionGetter(
  (e, k, v) => e.setAttribute(k, v),
  (e, k, v) => {
    if (v === NaN) throw new Error(`invalid prop: "${k}" value: ${v}`);
    e.setAttribute(k, v);
  },
  (e, k) => e.setAttribute(k, '')
);

const getPropertyUpdaterAction = createAttributeActionGetter(
  (e, k, v) => isVoid(v) ? e.removeAttribute(k) : e.setAttribute(k, v),
  (e, k, v) => {
    if (v === NaN) throw new Error(`invalid prop: "${k}" value: ${v}`);
    isVoid(v) ? e.removeAttribute(k) : e.setAttribute(k, v);
  },
  (e, k, v) => v ? e.removeAttribute(k) : e.setAttribute(k, '')
);

const updateInputProperty = (e, k, v) => e[k] = v;

const setInitialAttribute = (e, k, v) => {
  getAttributeSetterAction(k, v, typeof v)(e, k, v);
};

const getPropertyUpdater = (e, k, v, vT) => {
  if (e.tagName === 'INPUT' && (k === 'value' || k === 'checked')) {
    return updateInputProperty;
  }

  return getPropertyUpdaterAction(k, v, vT);
};

const createPropertyUpdater = (e, k, f, prev, prevT) => {
  const update = getPropertyUpdater(e, k, prev, prevT); // todo element could change maybe

  return () => {
    const v = f(), vT = typeof v;

    if (vT !== prevT && prev !== undefined && v !== undefined)
      throw new Error(`mismatch prop: "${k}" type prev: ${prev} next: ${v}`);

    // console.log({prev, v}); // todo refactor prev

    if (prev === v) return;
    prev = v;
    prevT = vT;

    update(e, k, v);
  };
};

export const initializeAttributes = (props, element) => {
  let updaters;

  for (let [k, v] of Object.entries(props)) {
    if (isEmpty(v));
    else if (k.startsWith('on')) {
      if (v && isFunction(v)) element.addEventListener(k.substring(2), v, false);
      else throw new Error(`not function prop: "${k}" value: ${v}`);
    }
    else if (k === 'ref') {
      if (v && isObject(v)) v.current = element; // todo function
      else throw new Error(`not object prop: "${k}" value: ${v}`);
    }
    else {
      if (v && isFunction(v)) {
        const f = v;
        v = v();
        updaters ??= [];
        updaters.push(createPropertyUpdater(element, k, f, v, typeof v));
      }

      if (! isEmpty(v)) setInitialAttribute(element, k, v);
    }
  }

  return updaters;
};

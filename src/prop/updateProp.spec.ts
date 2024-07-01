import {emptyAttribute} from './convertAttribute';
import {updateProp} from './updateProp';

const target = {
  getter: jest.fn(),
  setter: jest.fn(),
};

const supportedMethods = [
  'setAttribute',
  'setAttributeNS',
  'removeAttribute',
  'removeAttributeNS',
];

const element = new Proxy(target, {
  getPrototypeOf() {
    throw new Error('Must not be used');
  },
  setPrototypeOf() {
    throw new Error('Must not be used');
  },
  isExtensible() {
    throw new Error('Must not be used');
  },
  preventExtensions() {
    throw new Error('Must not be used');
  },
  getOwnPropertyDescriptor() {
    throw new Error('Must not be used');
  },
  defineProperty() {
    throw new Error('Must not be used');
  },
  has() {
    throw new Error('Must not be used');
  },
  get(target, key) {
    target.getter(key);

    if (supportedMethods.includes(key.toString())) {
      return (...as: any) => target.setter(key, ...as);
    }
  },
  set(target, key, value) {
    target.setter('setProperty', key, value);

    return true;
  },
  deleteProperty() {
    throw new Error('Must not be used');
  },
  ownKeys() {
    throw new Error('Must not be used');
  },
}) as any as Element;

const key = 'key';

test.each(
  // prettier-ignore
  [
    [ (): any => 8              , '8' , true  , undefined , undefined           , undefined ],
    [ (): any => 123            , '0' , true  , undefined , 'setAttribute'      , [ '123' ] ],
    [ (): any => 123            , '0' , true  , 'ns'      , 'setAttributeNS'    , [ '123' ] ],
    [ (): any => emptyAttribute , '3' , true  , undefined , 'removeAttribute'   , [       ] ],
    [ (): any => emptyAttribute , '3' , true  , 'ns'      , 'removeAttributeNS' , [       ] ],
    [ (): any => 123            , 0   , false , undefined , undefined           , [ 123   ] ],
    [ (): any => 123            , 123 , false , undefined , undefined           , undefined ],
  ],
)(
  'create %p %p %p %p %s %s %p',
  (update, value, isAttr, namespace, expectGet, expectSet) => {
    updateProp(element, key, {update, value, isAttr, namespace});

    if (expectGet) {
      expect(target.getter).toHaveBeenCalledTimes(1);
      expect(target.getter).toHaveBeenCalledWith(expectGet);
    } else {
      expect(target.getter).toHaveBeenCalledTimes(0);
    }

    if (expectSet) {
      expect(target.setter).toHaveBeenCalledTimes(1);
      expect(target.setter).toHaveBeenCalledWith(
        expectGet || 'setProperty',
        ...(namespace ? [namespace, key] : [key]),
        ...expectSet,
      );
    } else {
      expect(target.setter).toHaveBeenCalledTimes(0);
    }
  },
);

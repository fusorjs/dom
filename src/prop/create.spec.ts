import {UpdatableProp} from '../types';
import {createProp} from './create';

const existing = 'existing';

const target = {
  setter: jest.fn(),
  getter: jest.fn(),
  hasser: jest.fn(),
};

const element = new Proxy(target, {
  set(target, key, value) {
    target.setter('setProperty', key, value);

    return true;
  },
  get(target, key) {
    target.getter(key);

    switch (key) {
      case 'setAttribute':
        return (...as: any) => target.setter('setAttribute', ...as);
      case 'addEventListener':
        return (...as: any) => target.setter('addEventListener', ...as);
    }
  },
  has(target, key) {
    target.hasser(key);

    return key === existing;
  },
  getPrototypeOf() {
    return document.createElement('div'); // todo svg
  },
}) as any as Element;

test.each(
  // prettier-ignore
  [
    [ '$'                 , ''       , new TypeError(`empty name in property key 1 "$"`)                                       ],
    [ 'event$e'           , ''       , new TypeError(`not function event property "event$e"`)                                  ],
    [ 'event$e$capture'   , ''       , new TypeError(`not function event property "event$e$capture"`)                          ],
    [ 'event$e$once'      , ''       , new TypeError(`not function event property "event$e$once"`)                             ],
    [ 'event$e$unknown'   , () => {} , new TypeError(`out of capture|once|passive option in property key 3 "event$e$unknown"`) ],
    [ 'event$e$once$once' , () => {} , new TypeError(`same option declared twice in property key 4 "event$e$once$once"`)       ],
    [ 'type$x'            , () => {} , new TypeError(`out of a|p|e type in property key 2 "type$x"`)                           ],
  ],
)('throw %p %p %p', (key, value, expected) => {
  expect(() => {
    createProp(element, key, value);
  }).toThrow(expected);

  expect(target.hasser).toHaveBeenCalledTimes(0);
  expect(target.getter).toHaveBeenCalledTimes(0);
  expect(target.setter).toHaveBeenCalledTimes(0);
});

test.each(
  // prettier-ignore
  [
          [ existing , ''           , null        , 'setProperty'      , 'static'  , 'scan'   , [ null            ] ] ,
          [ existing , ''           , 123         , 'setProperty'      , 'static'  , 'scan'   , [ 123             ] ] ,
          [ existing , '$p'         , 123         , 'setProperty'      , 'static'  , 'figure' , [ 123             ] ] ,
          [ existing , ''           , () => 123   , 'setProperty'      , 'dynamic' , 'scan'   , [ 123             ] ] ,
          [ existing , '$p'         , () => 123   , 'setProperty'      , 'dynamic' , 'figure' , [ 123             ] ] ,
    (v => [ 'object' , ''           , v           , 'setProperty'      , 'static'  , 'figure' , [ v               ] ] )({}),
    (v => [ 'array'  , ''           , []          , 'setProperty'      , 'static'  , 'figure' , [ v               ] ] )([]),
          [ 'number' , '$p'         , 123         , 'setProperty'      , 'static'  , 'figure' , [ 123             ] ] ,
          [ 'func'   , '$p'         , () => 123   , 'setProperty'      , 'dynamic' , 'figure' , [ 123             ] ] ,
          [ 'null'   , ''           , null        , 'N/A'              , 'nothing' , 'scan'   , [ 'N/A'           ] ] ,
          [ 'null'   , '$a'         , null        , 'N/A'              , 'nothing' , 'figure' , [ 'N/A'           ] ] ,
          [ 'string' , ''           , 'asd'       , 'setAttribute'     , 'static'  , 'scan'   , [ 'asd'           ] ] ,
          [ 'number' , ''           , 123         , 'setAttribute'     , 'static'  , 'scan'   , [ '123'           ] ] ,
          [ 'string' , '$a'         , 'asd'       , 'setAttribute'     , 'static'  , 'figure' , [ 'asd'           ] ] ,
          [ 'string' , ''           , () => 'asd' , 'setAttribute'     , 'dynamic' , 'scan'   , [ 'asd'           ] ] ,
          [ 'number' , ''           , () => 123   , 'setAttribute'     , 'dynamic' , 'scan'   , [ '123'           ] ] ,
          [ 'string' , '$a'         , () => 'asd' , 'setAttribute'     , 'dynamic' , 'figure' , [ 'asd'           ] ] ,
    (v => [ 'click'  , '$e'         , v           , 'addEventListener' , 'static'  , 'figure' , [ v               ] ] )(() => 123),
    (v => [ 'click'  , '$e'         , v           , 'addEventListener' , 'static'  , 'figure' , [ v.handle, v     ] ] )({handle: () => 123}),
    (v => [ 'click'  , '$e$capture' , v           , 'addEventListener' , 'static'  , 'figure' , [ v, true         ] ] )(() => 123),
    (v => [ 'click'  , '$e$once'    , v           , 'addEventListener' , 'static'  , 'figure' , [ v, {once: true} ] ] )(() => 123),
  ],
)(
  `create "%s%s" %p %s %s %s %p`,
  (name, options, value, expectFunc, expectType, expectScan, expectVals) => {
    const result = createProp(element, name + options, value);

    // * result *
    switch (expectType) {
      case 'nothing':
        expect(result).toBeUndefined();
        break;

      case 'static':
        expect(result).toBeUndefined();
        break;

      case 'dynamic':
        expect(result).toEqual<UpdatableProp>({
          update: value as any,
          value: (value as any)(),
          isAttr: expectFunc === 'setAttribute',
        });
        break;
    }

    // * setter *
    if (expectType === 'nothing') {
      expect(target.setter).toHaveBeenCalledTimes(0);
    } else {
      expect(target.setter).toHaveBeenCalledTimes(1);
      expect(target.setter).toHaveBeenCalledWith(
        expectFunc,
        name,
        ...expectVals,
      );
    }

    // * hasser *
    if (expectScan === 'scan') {
      expect(target.hasser).toHaveBeenCalledTimes(1);
      expect(target.hasser).toHaveBeenCalledWith(name);
    } else {
      expect(target.hasser).toHaveBeenCalledTimes(0);
    }

    // * getter *
    if (expectType === 'nothing') {
      expect(target.getter).toHaveBeenCalledTimes(0);
    } else {
      if (expectFunc === 'setProperty') {
        expect(target.getter).toHaveBeenCalledTimes(0);
      } else {
        expect(target.getter).toHaveBeenCalledTimes(1);
        expect(target.getter).toHaveBeenCalledWith(expectFunc);
      }
    }
  },
);

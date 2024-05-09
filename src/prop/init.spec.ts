import {UpdatableProp} from '../types';
import {initProp} from './init';

const existing = 'existing';
const existSet = 'existSet';

const supportedMethods = ['setAttribute', 'setAttributeNS', 'addEventListener'];

const createTarget = () => {
  return {
    hasser: jest.fn(),
    getter: jest.fn(),
    setter: jest.fn(),
  };
};

const createElement = <T extends Function>(
  instance: Element,
  target: ReturnType<typeof createTarget>,
) => {
  return new Proxy(target, {
    getPrototypeOf() {
      return instance;
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
    getOwnPropertyDescriptor(_, key) {
      target.hasser(key);

      switch (key) {
        case existing:
          return {configurable: true, writable: true};
        case existSet:
          return {configurable: true, set: () => {}};
      }
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
};

const createChecker = (
  element: Element,
  target: ReturnType<typeof createTarget>,
) => {
  return (
    name: string,
    options: string,
    namespace: string | null | undefined,
    value: any,
    expectHas: string | undefined,
    expectGet: string | undefined,
    expectSet: any[] | undefined,
    expectRes: boolean,
  ) => {
    const result = initProp(
      element,
      name + options + (namespace ? '_' + namespace : ''),
      value,
    );

    // * hasser *
    if (expectHas) {
      expect(target.hasser).toHaveBeenCalledTimes(1);
      expect(target.hasser).toHaveBeenCalledWith(expectHas);
    } else {
      expect(target.hasser).toHaveBeenCalledTimes(0);
    }

    // * getter *
    if (expectGet) {
      expect(target.getter).toHaveBeenCalledTimes(1);
      expect(target.getter).toHaveBeenCalledWith(expectGet);
    } else {
      expect(target.getter).toHaveBeenCalledTimes(0);
    }

    // * setter *
    if (expectSet) {
      expect(target.setter).toHaveBeenCalledTimes(1);
      expect(target.setter).toHaveBeenCalledWith(
        expectGet || 'setProperty',
        ...(namespace === undefined
          ? [name, ...expectSet]
          : [namespace, name, ...expectSet]),
      );
    } else {
      expect(target.setter).toHaveBeenCalledTimes(0);
    }

    // * result *
    if (expectRes) {
      expect(result).toEqual<UpdatableProp>({
        update: value as any,
        value: (value as any)(),
        isAttr: expectGet !== undefined,
        ...(namespace === undefined ? {} : {namespace}),
      });
    } else {
      expect(result).toBeUndefined();
    }
  };
};

describe('html', () => {
  const target = createTarget();
  const element = createElement(document.createElement('section'), target);

  test.each(
    // prettier-ignore
    [
      [ '_'                 , ''       , TypeError , `empty name in key 1 "_"`                                                    ],
      [ 'prop_p_exta'       , ''       , TypeError , `excess option in property key 2 "prop_p_exta"`                              ],
      [ 'attr_a_exta'       , ''       , TypeError , `excess option in attribute key 2 "attr_a_exta"`                             ],
      [ 'attr_an'           , ''       , TypeError , `missing namespace option in attribute key 3 "attr_an"`                      ],
      [ 'attr_an_ns_exta'   , ''       , TypeError , `excess option in attribute key 4 "attr_an_ns_exta"`                         ],
      [ 'event_e'           , ''       , TypeError , `not function in event "event_e"`                                            ],
      [ 'event_e_capture'   , ''       , TypeError , `not function in event "event_e_capture"`                                    ],
      [ 'event_e_once'      , ''       , TypeError , `not function in event "event_e_once"`                                       ],
      [ 'event_e_unknown'   , () => {} , TypeError , `out of capture|once|passive|update option in event key 3 "event_e_unknown"` ],
      [ 'event_e_once_once' , () => {} , TypeError , `same option declared twice in event key 4 "event_e_once_once"`              ],
      [ 'type_x'            , () => {} , TypeError , `out of a|an|p|ps|e type in key 2 "type_x"`                                     ],
    ],
  )('throw %p %p %p', (key, value, expectType, expectMsg) => {
    expect(() => {
      initProp(element, key, value);
    }).toThrow(expectType);

    expect(() => {
      initProp(element, key, value);
    }).toThrow(expectMsg);

    expect(target.hasser).toHaveBeenCalledTimes(0);
    expect(target.getter).toHaveBeenCalledTimes(0);
    expect(target.setter).toHaveBeenCalledTimes(0);
  });
});

describe('html', () => {
  const target = createTarget();
  const element = createElement(document.createElement('section'), target);
  const checker = createChecker(element, target);

  test.each(
    // prettier-ignore
    [ //    name     | options      | namespace | value       | expectHas | expectGet          | expectSet           | expectRes
          [ existing , ''           , undefined , null        , existing  , undefined          , [ null            ] , false ] ,
          [ existing , ''           , undefined , 123         , existing  , undefined          , [ 123             ] , false ] ,
          [ existing , '_p'         , undefined , 123         , undefined , undefined          , [ 123             ] , false ] ,
          [ existing , ''           , undefined , () => 123   , existing  , undefined          , [ 123             ] , true  ] ,
          [ existing , '_p'         , undefined , () => 123   , undefined , undefined          , [ 123             ] , true  ] ,
          [ existSet , ''           , undefined , 123         , existSet  , undefined          , [ 123             ] , false ] ,
    (v => [ 'prop'   , ''           , undefined , v           , undefined , undefined          , [ v               ] , false ] )({}),
    (v => [ 'prop'   , ''           , undefined , []          , undefined , undefined          , [ v               ] , false ] )([]),
          [ 'prop'   , '_p'         , undefined , 123         , undefined , undefined          , [ 123             ] , false ] ,
          [ 'prop'   , '_p'         , undefined , () => 123   , undefined , undefined          , [ 123             ] , true  ] ,
    (v => [ 'prop'   , '_ps'        , undefined , v           , undefined , undefined          , [ v               ] , false ] )(() => 123),
          [ 'empty'  , ''           , undefined , null        , 'empty'   , undefined          , undefined           , false ] ,
          [ 'empty'  , '_a'         , undefined , null        , undefined , undefined          , undefined           , false ] ,
          [ 'attr'   , ''           , undefined , 'asd'       , 'attr'    , 'setAttribute'     , [ 'asd'           ] , false ] ,
          [ 'attr'   , ''           , undefined , 123         , 'attr'    , 'setAttribute'     , [ '123'           ] , false ] ,
          [ 'attr'   , '_a'         , undefined , 'asd'       , undefined , 'setAttribute'     , [ 'asd'           ] , false ] ,
          [ 'attr'   , ''           , undefined , () => 'asd' , 'attr'    , 'setAttribute'     , [ 'asd'           ] , true  ] ,
          [ 'attr'   , ''           , undefined , () => 123   , 'attr'    , 'setAttribute'     , [ '123'           ] , true  ] ,
          [ 'attr'   , '_a'         , undefined , () => 'asd' , undefined , 'setAttribute'     , [ 'asd'           ] , true  ] ,
          [ 'attr'   , '_an'        , 'ns'      , ():any=>123 , undefined , 'setAttributeNS'   , [ '123'           ] , true  ] ,
          [ 'attr'   , '_an'        , 'ns'      , 123         , undefined , 'setAttributeNS'   , [ '123'           ] , false ] ,
          [ 'attr'   , '_an'        , 'ns'      , 'abc'       , undefined , 'setAttributeNS'   , [ 'abc'           ] , false ] ,
    (v => [ 'event'  , '_e'         , undefined , v           , undefined , 'addEventListener' , [ v               ] , false ] )(() => 123),
    (v => [ 'event'  , '_e'         , undefined , v           , undefined , 'addEventListener' , [ v.handle, v     ] , false ] )({handle: () => 123}),
    (v => [ 'event'  , '_e'         , undefined , v           , undefined , 'addEventListener' , [ v.handle, v     ] , false ] )({handle: {handleEvent: () => 123}}),
    (v => [ 'event'  , '_e_capture' , undefined , v           , undefined , 'addEventListener' , [ v, true         ] , false ] )(() => 123),
    (v => [ 'event'  , '_e_once'    , undefined , v           , undefined , 'addEventListener' , [ v, {once: true} ] , false ] )(() => 123),
  ], //     name     | options      | namespace | value       | expectHas | expectGet          | expectSet           | expectRes
  )(`create "%s%s" %p %s %s %s %p`, checker);
});

describe('svg', () => {
  const target = createTarget();
  const element = createElement(
    document.createElementNS('http://www.w3.org/2000/svg', 'rect'),
    target,
  );
  const checker = createChecker(element, target);

  test.each(
    // prettier-ignore
    [ //    name     | options      | namespace | value       | expectHas | expectGet          | expectSet           | expectRes
          [ 'attr'   , '_a'         , null      , () => 'asd' , undefined , 'setAttributeNS'   , [ 'asd'           ] , true  ] ,
    ], //   name     | options      | namespace | value       | expectHas | expectGet          | expectSet           | expectRes
  )(`create "%s%s" %p %s %s %s %p`, checker);
});

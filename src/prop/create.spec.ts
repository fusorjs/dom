import {UpdatableProp} from '../types';
import {createProp} from './create';

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
    const result = createProp(
      element,
      name + options + (namespace ? '$' + namespace : ''),
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
      [ '$'                 , ''       , new TypeError(`empty name in key 1 "$"`)                                             ],
      [ 'prop$p$exta'       , ''       , new TypeError(`excess option in property key 2 "prop$p$exta"`)                       ],
      [ 'attr$a$exta'       , ''       , new TypeError(`excess option in attribute key 2 "attr$a$exta"`)                      ],
      [ 'attr$an'           , ''       , new TypeError(`missing namespace option in attribute key 3 "attr$an"`)               ],
      [ 'attr$an$ns$exta'   , ''       , new TypeError(`excess option in attribute key 4 "attr$an$ns$exta"`)                  ],
      [ 'event$e'           , ''       , new TypeError(`not function in event "event$e"`)                                     ],
      [ 'event$e$capture'   , ''       , new TypeError(`not function in event "event$e$capture"`)                             ],
      [ 'event$e$once'      , ''       , new TypeError(`not function in event "event$e$once"`)                                ],
      [ 'event$e$unknown'   , () => {} , new TypeError(`out of capture|once|passive option in event key 3 "event$e$unknown"`) ],
      [ 'event$e$once$once' , () => {} , new TypeError(`same option declared twice in event key 4 "event$e$once$once"`)       ],
      [ 'type$x'            , () => {} , new TypeError(`out of a|an|p|e type in key 2 "type$x"`)                              ],
    ],
  )('throw %p %p %p', (key, value, expected) => {
    expect(() => {
      createProp(element, key, value);
    }).toThrow(expected);

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
          [ existing , '$p'         , undefined , 123         , undefined , undefined          , [ 123             ] , false ] ,
          [ existing , ''           , undefined , () => 123   , existing  , undefined          , [ 123             ] , true  ] ,
          [ existing , '$p'         , undefined , () => 123   , undefined , undefined          , [ 123             ] , true  ] ,
          [ existSet , ''           , undefined , 123         , existSet  , undefined          , [ 123             ] , false ] ,
    (v => [ 'prop'   , ''           , undefined , v           , undefined , undefined          , [ v               ] , false ] )({}),
    (v => [ 'prop'   , ''           , undefined , []          , undefined , undefined          , [ v               ] , false ] )([]),
          [ 'prop'   , '$p'         , undefined , 123         , undefined , undefined          , [ 123             ] , false ] ,
          [ 'prop'   , '$p'         , undefined , () => 123   , undefined , undefined          , [ 123             ] , true  ] ,
          [ 'empty'  , ''           , undefined , null        , 'empty'   , undefined          , undefined           , false ] ,
          [ 'empty'  , '$a'         , undefined , null        , undefined , undefined          , undefined           , false ] ,
          [ 'attr'   , ''           , undefined , 'asd'       , 'attr'    , 'setAttribute'     , [ 'asd'           ] , false ] ,
          [ 'attr'   , ''           , undefined , 123         , 'attr'    , 'setAttribute'     , [ '123'           ] , false ] ,
          [ 'attr'   , '$a'         , undefined , 'asd'       , undefined , 'setAttribute'     , [ 'asd'           ] , false ] ,
          [ 'attr'   , ''           , undefined , () => 'asd' , 'attr'    , 'setAttribute'     , [ 'asd'           ] , true  ] ,
          [ 'attr'   , ''           , undefined , () => 123   , 'attr'    , 'setAttribute'     , [ '123'           ] , true  ] ,
          [ 'attr'   , '$a'         , undefined , () => 'asd' , undefined , 'setAttribute'     , [ 'asd'           ] , true  ] ,
          [ 'attr'   , '$an'        , 'ns'      , ():any=>123 , undefined , 'setAttributeNS'   , [ '123'           ] , true  ] ,
          [ 'attr'   , '$an'        , 'ns'      , 123         , undefined , 'setAttributeNS'   , [ '123'           ] , false ] ,
          [ 'attr'   , '$an'        , 'ns'      , 'abc'       , undefined , 'setAttributeNS'   , [ 'abc'           ] , false ] ,
    (v => [ 'event'  , '$e'         , undefined , v           , undefined , 'addEventListener' , [ v               ] , false ] )(() => 123),
    (v => [ 'event'  , '$e'         , undefined , v           , undefined , 'addEventListener' , [ v.handle, v     ] , false ] )({handle: () => 123}),
    (v => [ 'event'  , '$e'         , undefined , v           , undefined , 'addEventListener' , [ v.handle, v     ] , false ] )({handle: {handleEvent: () => 123}}),
    (v => [ 'event'  , '$e$capture' , undefined , v           , undefined , 'addEventListener' , [ v, true         ] , false ] )(() => 123),
    (v => [ 'event'  , '$e$once'    , undefined , v           , undefined , 'addEventListener' , [ v, {once: true} ] , false ] )(() => 123),
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
          [ 'attr'   , '$a'         , null      , () => 'asd' , undefined , 'setAttributeNS'   , [ 'asd'           ] , true  ] ,
    ], //   name     | options      | namespace | value       | expectHas | expectGet          | expectSet           | expectRes
  )(`create "%s%s" %p %s %s %s %p`, checker);
});

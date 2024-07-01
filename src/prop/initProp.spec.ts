import {ProxyLog, elm, logger} from '../lib/proxyLogger';
import {UpdatableProp} from '../types';
// import {update} from '../public';

import {initProp} from './initProp';

jest.mock('../public', () => ({
  __esModule: true,
  ...jest.requireActual('../public'),
  update: (main: any) => {
    main.update;
  },
}));

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

describe('html', () => {
  const target = createTarget();
  const element = createElement(document.createElement('section'), target);

  test.each(
    // prettier-ignore
    [
      [ '_'                 , ''       , TypeError , `empty name in key 1 "_"`                                       ],
      [ 'prop_p_exta'       , ''       , TypeError , `excess option in property key 2 "prop_p_exta"`                 ],
      [ 'attr_a_exta'       , ''       , TypeError , `excess option in attribute key 2 "attr_a_exta"`                ],
      [ 'attr_an'           , ''       , TypeError , `missing namespace option in attribute key 3 "attr_an"`         ],
      [ 'attr_an_ns_exta'   , ''       , TypeError , `excess option in attribute key 4 "attr_an_ns_exta"`            ],
      [ 'event_e_once'      , ''       , TypeError , `invalid value for event property "event_e_once"`               ],
      [ 'event_e_unknown'   , () => {} , TypeError , `invalid event property key "event_e_unknown" option "unknown"` ],
      [ 'event_e_capture'   , {}       , TypeError , `invalid callback for event property "event_e_capture"`         ],
      [ 'type_x'            , () => {} , TypeError , `invalid property key type "x" in "type_x"`                     ],
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

    const isAttr = expectGet !== undefined;

    // * result *
    if (expectRes) {
      expect(result).toEqual<UpdatableProp>({
        update: value as any,
        value: isAttr ? String((value as any)()) : (value as any)(),
        isAttr,
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

type TestValues = {
  providedValue: any;
  expectedReturn: ReturnType<typeof initProp>;
};

test.each<
  [
    key: string,
    values: TestValues | ((log: ProxyLog) => TestValues),
    expectedLog: string[],
  ]
>([
  // Special ---------------------------------------------

  [
    '__self',
    {
      providedValue: 123,
      expectedReturn: undefined,
    },
    [],
  ],

  [
    '__source',
    {
      providedValue: 123,
      expectedReturn: undefined,
    },
    [],
  ],

  [
    'is',
    {
      providedValue: 123,
      expectedReturn: undefined,
    },
    [],
  ],

  [
    'mount',
    {
      providedValue: 123,
      expectedReturn: undefined,
    },
    [],
  ],

  // Events ----------------------------------------------

  [
    'click_e',
    (log) => {
      return {
        providedValue: logger(() => 123, log, 'handle'),
        expectedReturn: undefined,
      };
    },
    [
      'main.addEventListener',
      'main.addEventListener apply "click" #function undefined >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      'handle apply {"isTrusted":false} main >> 123',
    ],
  ],

  [
    'click_e options',
    (log) => {
      return {
        providedValue: logger({handle: () => 123}, log, 'options'),
        expectedReturn: undefined,
      };
    },
    [
      'options.handle',
      'options.capture >> undefined',
      'options.once >> undefined',
      'options.passive >> undefined',
      'options.signal >> undefined',
      'options.update >> undefined',
      'main.addEventListener',
      'main.addEventListener apply "click" #function {"capture":undefined,"once":undefined,"passive":undefined,"signal":undefined} >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      'options.handle apply {"isTrusted":false} main >> 123',
    ],
  ],

  [
    'click_e_passive options override',
    (log) => {
      return {
        providedValue: logger(
          {passive: false, handle: () => 123},
          log,
          'options',
        ),
        expectedReturn: undefined,
      };
    },
    [
      'options.handle',
      'options.capture >> undefined',
      'options.once >> undefined',
      'options.passive >> false',
      'options.signal >> undefined',
      'options.update >> undefined',
      'main.addEventListener',
      'main.addEventListener apply "click" #function {"capture":undefined,"once":undefined,"passive":true,"signal":undefined} >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      'options.handle apply {"isTrusted":false} main >> 123',
    ],
  ],

  [
    'click_e options object',
    (log) => {
      return {
        providedValue: logger(
          {handle: {handleEvent: () => 123}},
          log,
          'options',
        ),
        expectedReturn: undefined,
      };
    },
    [
      'options.handle',
      'options.handle.handleEvent',
      'options.handle.handleEvent.bind',
      'options.handle.handleEvent.bind apply options.handle >> #3',
      'options.capture >> undefined',
      'options.once >> undefined',
      'options.passive >> undefined',
      'options.signal >> undefined',
      'options.update >> undefined',
      'main.addEventListener',
      'main.addEventListener apply "click" #function {"capture":undefined,"once":undefined,"passive":undefined,"signal":undefined} >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      '#3 apply {"isTrusted":false} main >> 123',
    ],
  ],

  [
    'click_e object',
    (log) => {
      return {
        providedValue: logger({handleEvent: () => 123}, log, 'object'),
        expectedReturn: undefined,
      };
    },
    [
      'object.handle >> undefined',
      'object.handleEvent',
      'object.handleEvent.bind',
      'object.handleEvent.bind apply object >> #3',
      'main.addEventListener',
      'main.addEventListener apply "click" #function undefined >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      '#3 apply {"isTrusted":false} main >> 123',
    ],
  ],

  [
    'click_e_capture',
    (log) => {
      return {
        providedValue: logger(() => 123, log, 'handle'),
        expectedReturn: undefined,
      };
    },
    [
      'main.addEventListener',
      'main.addEventListener apply "click" #function true >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      'handle apply {"isTrusted":false} main >> 123',
    ],
  ],

  [
    'click_e_once',
    (log) => {
      return {
        providedValue: logger(() => 123, log, 'handle'),
        expectedReturn: undefined,
      };
    },
    [
      'main.addEventListener',
      'main.addEventListener apply "click" #function {"capture":undefined,"once":true,"passive":undefined} >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      'handle apply {"isTrusted":false} main >> 123',
    ],
  ],

  [
    'click_e_update',
    (log) => {
      return {
        providedValue: logger(() => 123, log, 'handle'),
        expectedReturn: undefined,
      };
    },
    [
      'main.addEventListener',
      'main.addEventListener apply "click" #function {"capture":undefined,"once":undefined,"passive":undefined} >> undefined',
      'main.dispatchEvent',
      'main.dispatchEvent apply {"isTrusted":false} >> true',
      'main._fusorjs >> undefined',
      'handle apply {"isTrusted":false} main >> 123',
      'main.update >> undefined',
    ],
  ],
])('initProp: %s', (key, values, expectedLog) => {
  [key] = key.split(' '); // remove comments

  const log: ProxyLog = [];
  const main = logger(elm('main'), log, 'main');
  const {providedValue, expectedReturn} =
    typeof values === 'function' ? values(log) : values;
  const actualReturn = initProp(main, key, providedValue);

  if (key.includes('_e')) {
    // (update as any).mockImplementation(logger(() => {}, log, 'update'));
    main.dispatchEvent(new Event(key.split('_e')[0]));
  }

  expect(log).toEqual(expectedLog);
  log.disabled = true;
  expect(actualReturn).toEqual(expectedReturn);
});

import {ProxyLog, elm, logger} from '../common.spec';

import {SingleChild} from '../types';
import {Component} from '../component';

import {initChild} from './initChild';

test.each<
  [
    description: string,
    getValues: (log: ProxyLog) => {
      providedValue: SingleChild;
      expectedReturn: ReturnType<typeof initChild>;
    },
    expectedLog: string[],
  ]
>([
  [
    '"abc"',
    () => {
      return {
        providedValue: 'abc',
        expectedReturn: undefined,
      };
    },
    ['main get append', 'main run append abc'],
  ],

  [
    'false - empty child',
    () => {
      return {
        providedValue: false,
        expectedReturn: undefined,
      };
    },
    [],
  ],

  [
    '<div1>',
    (log) => {
      const div1 = logger(document.createElement('div1'), log, 'div1');
      return {
        providedValue: div1,
        expectedReturn: undefined,
      };
    },
    [
      'div1 getPrototypeOf',
      'main get appendChild',
      'main run appendChild div1',
    ],
  ],

  [
    'Component1',
    (log) => {
      const div1 = logger(elm('div1'), log, 'div1');
      const component1 = logger(new Component(div1), log, 'component1');
      return {
        providedValue: component1,
        expectedReturn: component1,
      };
    },
    [
      'component1 getPrototypeOf', // is Element
      'component1 getPrototypeOf', // is Component // todo optimize to one call
      'main get appendChild',
      'component1 get element',
      'main run appendChild div1',
    ],
  ],

  [
    '() => 123',
    (log) => {
      const update = logger(() => 123, log, 'update');
      return {
        providedValue: update,
        expectedReturn: {
          update,
          cache: {
            value: '123',
            node: new Text('123'),
          },
          terminator: null,
          arrayRef: null,
        },
      };
    },
    [
      'update getPrototypeOf',
      'update getPrototypeOf',
      'update apply ',
      'main get appendChild',
      'main run appendChild Text(123)',
    ],
  ],

  [
    '() => <div1>',
    (log) => {
      const div1 = logger(elm('div1'), log, 'div1');
      const update = logger(() => div1, log, 'update');
      return {
        providedValue: update,
        expectedReturn: {
          update,
          cache: {
            value: div1,
            node: div1,
          },
          terminator: null,
          arrayRef: null,
        },
      };
    },
    [
      'update getPrototypeOf',
      'update getPrototypeOf',
      'update apply ',
      'div1 getPrototypeOf',
      'main get appendChild',
      'main run appendChild div1',
    ],
  ],

  [
    '() => Component',
    (log) => {
      const div1 = logger(elm('div1'), log, 'div1');
      const component1 = logger(new Component(div1), log, 'component1');
      const update = logger(() => component1, log, 'update');
      return {
        providedValue: update,
        expectedReturn: {
          update,
          cache: {
            value: component1,
            node: div1,
          },
          terminator: null,
          arrayRef: null,
        },
      };
    },
    [
      'update getPrototypeOf',
      'update getPrototypeOf',
      'update apply ',
      'component1 getPrototypeOf',
      'component1 getPrototypeOf',
      'component1 get element',
      'main get appendChild',
      'main run appendChild div1',
    ],
  ],

  [
    '() => [1,2,3]',
    (log) => {
      const arrayRef = logger([1, 2, 3], log, 'arrayRef');
      const update = logger(() => arrayRef, log, 'update');
      return {
        providedValue: update,
        expectedReturn: {
          update,
          cache: [
            {
              value: '1',
              node: new Text('1'),
            },
            {
              value: '2',
              node: new Text('2'),
            },
            {
              value: '3',
              node: new Text('3'),
            },
          ],
          terminator: new Text(),
          arrayRef,
        },
      };
    },
    [
      'update getPrototypeOf',
      'update getPrototypeOf',
      'update apply ',
      'arrayRef get Symbol(Symbol.iterator)',
      'arrayRef run Symbol(Symbol.iterator) ',
      'main get appendChild',
      'main run appendChild Text(1)',
      'main get appendChild', // todo optimize to one call
      'main run appendChild Text(2)',
      'main get appendChild',
      'main run appendChild Text(3)',
      'main get appendChild',
      'main run appendChild Text()',
    ],
  ],

  [
    '() => []',
    (log) => {
      const arrayRef = logger([], log, 'arrayRef');
      const update = logger(() => arrayRef, log, 'update');
      return {
        providedValue: update,
        expectedReturn: {
          update,
          cache: [],
          terminator: new Text(),
          arrayRef,
        },
      };
    },
    [
      'update getPrototypeOf',
      'update getPrototypeOf',
      'update apply ',
      'arrayRef get Symbol(Symbol.iterator)',
      'arrayRef run Symbol(Symbol.iterator) ',
      'main get appendChild',
      'main run appendChild Text()',
    ],
  ],

  [
    '() => [() => 22]',
    (log) => {
      const fun1 = logger(() => 22, log, 'fun1');
      const arrayRef = logger([fun1], log, 'arrayRef');
      const update = logger(() => arrayRef, log, 'update');
      return {
        providedValue: update,
        expectedReturn: {
          update,
          cache: [
            {
              value: '22',
              node: new Text('22'),
            },
          ],
          terminator: new Text(),
          arrayRef,
        },
      };
    },
    [
      'update getPrototypeOf',
      'update getPrototypeOf',
      'update apply ',
      'arrayRef get Symbol(Symbol.iterator)',
      'arrayRef run Symbol(Symbol.iterator) ',
      'fun1 apply ',
      'main get appendChild',
      'main run appendChild Text(22)',
      'main get appendChild',
      'main run appendChild Text()',
    ],
  ],
])('initChild %s', (description, getValues, expectedLog) => {
  const log: ProxyLog = [];

  const main = logger(elm('main'), log, 'main');
  const {providedValue, expectedReturn} = getValues(log);

  const actualReturn = initChild(main, providedValue);

  expect(log).toEqual(expectedLog);

  log.disabled = true;

  expect(actualReturn).toEqual(expectedReturn);
});

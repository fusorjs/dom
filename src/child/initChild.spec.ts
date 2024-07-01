import {ProxyLog, elm, logger} from '../lib/proxyLogger';

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
    ['main.append', 'main.append apply "abc" >> undefined'],
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
      'main.appendChild',
      'main.appendChild apply div1 >> #2',
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
      'main.appendChild',
      'component1.element >> div1',
      'main.appendChild apply div1 >> #4',
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
      'update apply >> 123',
      'main.appendChild',
      'main.appendChild apply Text(123) >> #4',
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
      'update apply >> div1',
      'div1 getPrototypeOf',
      'main.appendChild',
      'main.appendChild apply div1 >> #5',
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
      'update apply >> component1',
      'component1 getPrototypeOf',
      'component1 getPrototypeOf',
      'component1.element >> div1',
      'main.appendChild',
      'main.appendChild apply div1 >> #7',
    ],
  ],

  [
    '() => [1,2,3]',
    (log) => {
      const arrayRef = logger([1, 2, 3], log, 'array');
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
      'update apply >> array',
      'array.Symbol(Symbol.iterator)',
      'array.Symbol(Symbol.iterator) apply >> #4',
      '#4.next',
      '#4.next apply >> #6',
      '#6.done >> false',
      '#6.value >> 1',
      'main.appendChild',
      'main.appendChild apply Text(1) >> #10',
      '#4.next apply >> #11',
      '#11.done >> false',
      '#11.value >> 2',
      'main.appendChild', // todo optimize to one call
      'main.appendChild apply Text(2) >> #15',
      '#4.next apply >> #16',
      '#16.done >> false',
      '#16.value >> 3',
      'main.appendChild',
      'main.appendChild apply Text(3) >> #20',
      '#4.next apply >> #21',
      '#21.done >> true',
      'main.appendChild',
      'main.appendChild apply Text() >> #24',
    ],
  ],

  [
    '() => []',
    (log) => {
      const arrayRef = logger([], log, 'array');
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
      'update apply >> array',
      'array.Symbol(Symbol.iterator)',
      'array.Symbol(Symbol.iterator) apply >> #4',
      '#4.next',
      '#4.next apply >> #6',
      '#6.done >> true',
      'main.appendChild',
      'main.appendChild apply Text() >> #9',
    ],
  ],

  [
    '() => [() => 22]',
    (log) => {
      const arrayRef = logger([() => 22], log, 'array');
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
      'update apply >> array',
      'array.Symbol(Symbol.iterator)',
      'array.Symbol(Symbol.iterator) apply >> #4',
      '#4.next',
      '#4.next apply >> #6',
      '#6.done >> false',
      '#6.value',
      '#6.value apply >> 22',
      'main.appendChild',
      'main.appendChild apply Text(22) >> #11',
      '#4.next apply >> #12',
      '#12.done >> true',
      'main.appendChild',
      'main.appendChild apply Text() >> #15',
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

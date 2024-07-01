import {ProxyLog, ProxyTarget, logger, elm} from '../lib/proxyLogger';

import {UpdatableChild, UpdatableChildren} from '../types';
import {Component} from '../component';

import {updateChild} from './updateChild';

test.each<
  [
    description: string,
    getUpdatables: (
      log: ProxyLog,
      main: ProxyTarget<HTMLElement>,
    ) => {
      providedUpdatable: UpdatableChild | UpdatableChildren;
      expectedUpdatable: UpdatableChild | UpdatableChildren;
    },
    expectedLog: string[],
  ]
>([
  [
    '"13" to 123',
    (log, main) => {
      const text1 = logger(new Text('13'), log, 'text1');

      main._t.append(text1);

      const update = logger(() => 123, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: {value: '13', node: text1},
          arrayRef: null,
          terminator: null,
        },
        expectedUpdatable: {
          update,
          cache: {value: '123', node: new Text('123')},
          arrayRef: null,
          terminator: null,
        },
      };
    },
    [
      'update apply >> 123',
      'main.replaceChild',
      'main.replaceChild apply Text(123) text1 >> #2',
    ],
  ],

  [
    '"13" to 13',
    (log, main) => {
      const text1 = logger(new Text('13'), log, 'text1');

      main._t.append(text1);

      const update = logger(() => 13, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: {value: '13', node: text1},
          arrayRef: null,
          terminator: null,
        },
        expectedUpdatable: {
          update,
          cache: {value: '13', node: new Text('13')},
          arrayRef: null,
          terminator: null,
        },
      };
    },
    ['update apply >> 13'],
  ],

  [
    '"13" to "13"',
    (log, main) => {
      const text1 = logger(new Text('13'), log, 'text1');

      main._t.append(text1);

      const update = logger(() => '13', log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: {value: '13', node: text1},
          arrayRef: null,
          terminator: null,
        },
        expectedUpdatable: {
          update,
          cache: {value: '13', node: new Text('13')},
          arrayRef: null,
          terminator: null,
        },
      };
    },
    ['update apply >> "13"'],
  ],

  [
    '"" to false',
    (log, main) => {
      const text1 = logger(new Text(), log, 'text1');

      main._t.append(text1);

      const update = logger(() => false, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: {value: '', node: text1},
          arrayRef: null,
          terminator: null,
        },
        expectedUpdatable: {
          update,
          cache: {value: '', node: new Text()},
          arrayRef: null,
          terminator: null,
        },
      };
    },
    ['update apply >> false'],
  ],

  [
    '[] to [] same array by reference',
    (log, main) => {
      const terminator = logger(new Text(), log, 'terminator');

      main._t.append(terminator);

      const arrayRef = logger([], log, 'arrayRef');
      const update = logger(() => arrayRef, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: [],
          arrayRef,
          terminator,
        },
        expectedUpdatable: {
          update,
          cache: [],
          arrayRef,
          terminator,
        },
      };
    },
    ['update apply >> arrayRef'],
  ],

  [
    '["1","2","3","4",<span1>] to [11,<div1>,()=>33,Component1,55]',
    (log, main) => {
      const text1 = logger(new Text('1'), log, 'text1');
      const text2 = logger(new Text('2'), log, 'text2');
      const text3 = logger(new Text('3'), log, 'text3');
      const text4 = logger(new Text('4'), log, 'text4');
      const span1 = logger(elm('span1'), log, 'span1');
      const terminator = logger(new Text(), log, 'terminator');

      main._t.append(text1, text2, text3, text4, span1, terminator);

      const div1 = logger(elm('div1'), log, 'div1');
      const div2 = logger(elm('div2'), log, 'div2');
      const component1 = logger(new Component(div2), log, 'component1');
      const arrayRef = logger(
        [11, div1, () => 33, component1, 55],
        log,
        'arrayRef',
      );
      const update = logger(() => arrayRef, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: [
            {value: '1', node: text1},
            {value: '2', node: text2},
            {value: '3', node: text3},
            {value: '4', node: text4},
            {value: span1, node: span1},
          ],
          arrayRef: ['1', '2', '3', '4', span1],
          terminator,
        },
        expectedUpdatable: {
          update,
          cache: [
            {value: '11', node: new Text('11')},
            {value: div1, node: div1},
            {value: '33', node: new Text('33')},
            {value: component1, node: div2},
            {value: '55', node: new Text('55')},
          ],
          arrayRef,
          terminator,
        },
      };
    },
    [
      'update apply >> arrayRef',

      'arrayRef.length >> 5',
      'arrayRef.0 >> 11',
      'main.replaceChild',
      'main.replaceChild apply Text(11) text1 >> #4',

      'arrayRef.1 >> div1',
      'div1 getPrototypeOf',
      'main.replaceChild',
      'main.replaceChild apply div1 text2 >> #8',

      'arrayRef.2',
      'arrayRef.2 apply >> 33',
      'main.replaceChild',
      'main.replaceChild apply Text(33) text3 >> #12',

      'arrayRef.3 >> component1',
      'component1 getPrototypeOf', // instanceof Element
      'component1 getPrototypeOf', // instanceof Component
      'component1.element >> div2',
      'main.replaceChild',
      'main.replaceChild apply div2 text4 >> #18',

      'arrayRef.4 >> 55',
      'main.replaceChild',
      'main.replaceChild apply Text(55) span1 >> #21',
    ],
  ],

  [
    '["1"] to [1,<div1>,Component1,()=>22]',
    (log, main) => {
      const text1 = logger(new Text('1'), log, 'text1');
      const terminator = logger(new Text(), log, 'terminator');

      main._t.append(text1, terminator);

      const div1 = logger(elm('div1'), log, 'div1');
      const div2 = logger(elm('div2'), log, 'div2');
      const component1 = logger(new Component(div2), log, 'component1');
      const arrayRef = logger([1, div1, component1, () => 22], log, 'arrayRef');
      const update = logger(() => arrayRef, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: [{value: '1', node: text1}],
          arrayRef: ['1'],
          terminator,
        },
        expectedUpdatable: {
          update,
          cache: [
            {value: '1', node: new Text('1')},
            {value: div1, node: div1},
            {value: component1, node: div2},
            {value: '22', node: new Text('22')},
          ],
          arrayRef,
          terminator,
        },
      };
    },
    [
      'update apply >> arrayRef',
      'arrayRef.length >> 4',
      'arrayRef.0 >> 1', // skip same value
      // insert div
      'arrayRef.1 >> div1',
      'div1 getPrototypeOf',
      'main.insertBefore',
      'main.insertBefore apply div1 terminator >> #6',
      // insert component
      'arrayRef.2 >> component1',
      'component1 getPrototypeOf', // instanceof Element
      'component1 getPrototypeOf', // instanceof Component
      'component1.element >> div2',
      'main.insertBefore',
      'main.insertBefore apply div2 terminator >> #12',
      // insert 22
      'arrayRef.3',
      'arrayRef.3 apply >> 22',
      'main.insertBefore',
      'main.insertBefore apply Text(22) terminator >> #16',
    ],
  ],

  [
    '"123" to [1,2,3] without prev terminator',
    (log, main) => {
      const text1 = logger(new Text('123'), log, 'text1');

      main._t.append(text1);

      const arrayRef = logger([1, 2, 3], log, 'array');
      const update = logger(() => arrayRef, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: {value: '123', node: text1},
          arrayRef: null,
          terminator: null,
        },
        expectedUpdatable: {
          update,
          cache: [
            {value: '1', node: new Text('1')},
            {value: '2', node: new Text('2')},
            {value: '3', node: new Text('3')},
          ],
          arrayRef,
          terminator: new Text(),
        },
      };
    },
    [
      // insert terminator
      'update apply >> array',
      'main.insertBefore',
      'text1.nextSibling >> null',
      'main.insertBefore apply Text() null >> #3', // terminator
      // replace "123" to 1
      'array.length >> 3',
      'array.0 >> 1',
      'main.replaceChild',
      'main.replaceChild apply Text(1) text1 >> #7',
      // insert 2
      'array.1 >> 2',
      'main.insertBefore',
      'main.insertBefore apply Text(2) #3 >> #10',
      // insert 3
      'array.2 >> 3',
      'main.insertBefore',
      'main.insertBefore apply Text(3) #3 >> #13',
    ],
  ],

  [
    '"123" to [1,2,3] with prev terminator',
    (log, main) => {
      const text1 = logger(new Text('123'), log, 'text1');
      const terminator = logger(new Text(), log, 'terminator');

      main._t.append(text1, terminator);

      const arrayRef = logger([1, 2, 3], log, 'array');
      const update = logger(() => arrayRef, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: {value: '123', node: text1}, // todo logger
          arrayRef: null,
          terminator,
        },
        expectedUpdatable: {
          update,
          cache: [
            {value: '1', node: new Text('1')},
            {value: '2', node: new Text('2')},
            {value: '3', node: new Text('3')},
          ],
          arrayRef,
          terminator,
        },
      };
    },
    [
      'update apply >> array',
      'array.length >> 3',
      'array.0 >> 1',
      'main.replaceChild',
      'main.replaceChild apply Text(1) text1 >> #4',
      'array.1 >> 2',
      'main.insertBefore',
      'main.insertBefore apply Text(2) terminator >> #7',
      'array.2 >> 3',
      'main.insertBefore',
      'main.insertBefore apply Text(3) terminator >> #10',
    ],
  ],

  [
    '["1","2","3"] to 123',
    (log, main) => {
      const text1 = logger(new Text('1'), log, 'text1');
      const text2 = logger(new Text('2'), log, 'text2');
      const text3 = logger(new Text('3'), log, 'text3');
      const terminator = logger(new Text(), log, 'terminator');

      main._t.append(text1, text2, text3, terminator);

      const update = logger(() => 123, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: [
            // todo logger
            {value: '1', node: text1},
            {value: '2', node: text2},
            {value: '3', node: text3},
          ],
          arrayRef: ['1', '2', '3'], // todo logger
          terminator,
        },
        expectedUpdatable: {
          update,
          cache: {value: '123', node: new Text('123')},
          arrayRef: null,
          terminator,
        },
      };
    },
    [
      'update apply >> 123',
      'main.replaceChild',
      'main.replaceChild apply Text(123) text1 >> #2',
      'main.removeChild',
      'main.removeChild apply text2 >> #4',
      'main.removeChild',
      'main.removeChild apply text3 >> #6',
    ],
  ],
])('updateChild %s', (description, getUpdatables, expectedLog) => {
  const log: ProxyLog = [];
  const main = logger(elm('main'), log, 'main');
  const {providedUpdatable, expectedUpdatable} = getUpdatables(log, main);

  updateChild(main, providedUpdatable);

  expect(log).toEqual(expectedLog);

  log.disabled = true;

  expect(providedUpdatable.update).toBe(expectedUpdatable.update);
  expect(providedUpdatable.arrayRef).toBe(expectedUpdatable.arrayRef);

  try {
    expect(providedUpdatable).toEqual(expectedUpdatable);
  } catch (e) {
    console.log(log);
    throw e;
  }
});

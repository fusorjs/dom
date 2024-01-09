import {ProxyLog, ProxyTarget, logger, elm} from '../common.spec';

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
    ['update apply ', 'text1 getPrototypeOf', 'text1 set nodeValue 123'],
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
    ['update apply '],
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
    ['update apply '],
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
    ['update apply '],
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
    ['update apply '],
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
      'update apply ',

      'arrayRef get length',
      'arrayRef get 0',
      'text1 getPrototypeOf',
      'text1 set nodeValue 11',

      'arrayRef get 1',
      'div1 getPrototypeOf',
      'main get replaceChild',
      'main run replaceChild div1 text2',

      'arrayRef get 2',
      'arrayRef run 2 ',
      'text3 getPrototypeOf',
      'text3 set nodeValue 33',

      'arrayRef get 3',
      'component1 getPrototypeOf', // instanceof Element
      'component1 getPrototypeOf', // instanceof Component
      'component1 get element',
      'main get replaceChild',
      'main run replaceChild div2 text4',

      'arrayRef get 4',
      'span1 getPrototypeOf',
      'main get replaceChild',
      'main run replaceChild Text(55) span1',
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
      'update apply ',
      'arrayRef get length',
      'arrayRef get 0',
      // insert div
      'arrayRef get 1',
      'div1 getPrototypeOf',
      'main get insertBefore',
      'main run insertBefore div1 terminator',
      // insert component
      'arrayRef get 2',
      'component1 getPrototypeOf', // instanceof Element
      'component1 getPrototypeOf', // instanceof Component
      'component1 get element',
      'main get insertBefore',
      'main run insertBefore div2 terminator',
      // insert 22
      'arrayRef get 3',
      'arrayRef run 3 ',
      'main get insertBefore',
      'main run insertBefore Text(22) terminator',
    ],
  ],

  [
    '"123" to [1,2,3] without prev terminator',
    (log, main) => {
      const text1 = logger(new Text('123'), log, 'text1');

      main._t.append(text1);

      const arrayRef = logger([1, 2, 3], log, 'arrayRef');
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
      'update apply ',
      'main get insertBefore',
      'text1 get nextSibling',
      'main run insertBefore Text() null',
      // change "123" to 1
      'arrayRef get length',
      'arrayRef get 0',
      'text1 getPrototypeOf',
      'text1 set nodeValue 1',
      // insert 2
      'arrayRef get 1',
      'main get insertBefore',
      'main run insertBefore Text(2) Text()',
      // insert 3
      'arrayRef get 2',
      'main get insertBefore',
      'main run insertBefore Text(3) Text()',
    ],
  ],

  [
    '"123" to [1,2,3] with prev terminator',
    (log, main) => {
      const text1 = logger(new Text('123'), log, 'text1');
      const terminator = logger(new Text(), log, 'terminator');

      main._t.append(text1, terminator);

      const arrayRef = logger([1, 2, 3], log, 'arrayRef');
      const update = logger(() => arrayRef, log, 'update');

      return {
        providedUpdatable: {
          update,
          cache: {value: '123', node: text1},
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
      'update apply ',
      'arrayRef get length',
      // change "123" to 1
      'arrayRef get 0',
      'text1 getPrototypeOf',
      'text1 set nodeValue 1',
      // insert 2
      'arrayRef get 1',
      'main get insertBefore',
      'main run insertBefore Text(2) terminator',
      // insert 3
      'arrayRef get 2',
      'main get insertBefore',
      'main run insertBefore Text(3) terminator',
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
            {value: '1', node: text1},
            {value: '2', node: text2},
            {value: '3', node: text3},
          ],
          arrayRef: ['1', '2', '3'],
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
      'update apply ',
      // change 1 to 123
      'text1 getPrototypeOf',
      'text1 set nodeValue 123',
      // remove 2
      'main get removeChild',
      'main run removeChild text2',
      // remove 3
      'main get removeChild',
      'main run removeChild text3',
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

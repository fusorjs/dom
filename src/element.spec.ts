import {Component} from './types';
import {initElement} from './element';

test('init empty', () => {
  const element = document.createElement('div');
  const result = initElement(element, []);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(0);
});

test('init static props', () => {
  const element = document.createElement('div');
  const result = initElement(element, [
    {
      title: 'hello',
      hidden: true,
      custom: 123,
    },
    {},
  ]);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(3);
  expect(element.childNodes.length).toBe(0);
  expect(element.title).toBe('hello');
  expect(element.hidden).toBe(true);
  expect(element.getAttribute('custom')).toEqual('123');
});

test('init static prop override', () => {
  const element = document.createElement('id');
  const result = initElement(element, [{id: 'one'}, {id: 'two'}]);

  expect(result).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.id).toBe('two');
});

test('init dynamic prop override', () => {
  let dynamic1 = 111;
  let dynamic2 = 222;

  const element = document.createElement('id');
  const result = initElement(element, [
    {id: () => dynamic1++},
    {id: () => dynamic2++},
  ]);

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);

  expect(element.attributes.length).toBe(1);
  expect(element.childNodes.length).toBe(0);
  expect(element.id).toBe('222');

  expect(dynamic1).toBe(112);
  expect(dynamic2).toBe(223);

  result.update();

  expect(element.id).toBe('223');
  expect(dynamic1).toBe(112); // did not increment
  expect(dynamic2).toBe(224);
});

// todo refactor start:
describe('initElement', () => {
  describe('props', () => {
    // todo types check
    // test('element with event props should be static', () => {
    //   const element = document.createElement('button');
    //   const result = initElement(element, {onclick: () => {}});
    //   expect(result).toBe(element);
    //   expect(result.attributes.length).toBe(1);
    //   expect(result.childNodes.length).toBe(0);
    // });

    test('button with two dynamic props objects overrides', () => {
      const element = document.createElement('button');
      const result = initElement(element, [
        {type: () => 'button'},
        {type: () => 'submit'},
      ]);

      expect(result).toBeInstanceOf(Component);
      expect(result.getElement()).toBe(element);
      expect(element.attributes.length).toBe(1);
      expect(element.childNodes.length).toBe(0);
      expect(element.type).toBe('submit');
    });

    test('div with dynamic prop', () => {
      let title = 'aaa';
      const element = document.createElement('div');
      const result = initElement(element, [{title: () => title}]);

      expect(result).toBeInstanceOf(Component);
      expect(result.getElement()).toBe(element);
      expect(element.attributes.length).toBe(1);
      expect(element.childNodes.length).toBe(0);
      expect(element.title).toBe('aaa');

      title = 'bbb';
      result.update();

      expect(element.attributes.length).toBe(1);
      expect(element.childNodes.length).toBe(0);
      expect(element.title).toBe('bbb');
    });
  });

  describe('children', () => {
    test('div with falsy child', () => {
      const element = document.createElement('div');
      const result = initElement(element, [undefined]);

      expect(result).toBe(element);
      expect(result.attributes.length).toBe(0);
      expect(result.childNodes.length).toBe(1);

      expect(result.childNodes[0].nodeValue).toBe('undefined');
    });

    test('div with three static children', () => {
      const element = document.createElement('div');
      const result = initElement(element, ['one', 2, 'three']);

      expect(result).toBe(element);
      expect(result.attributes.length).toBe(0);
      expect(result.childNodes.length).toBe(3);

      expect(result.childNodes[0].nodeValue).toBe('one');
      expect(result.childNodes[1].nodeValue).toBe('2');
      expect(result.childNodes[2].nodeValue).toBe('three');
    });

    test('div with dynamic child', () => {
      let child = 123;
      const element = document.createElement('div');
      const result = initElement(element, [() => child]);

      expect(result).toBeInstanceOf(Component);
      expect(result.getElement()).toBe(element);
      expect(element.attributes.length).toBe(0);
      expect(element.childNodes.length).toBe(1);

      expect(element.childNodes[0].nodeValue).toBe('123');

      child = 456;
      result.update();

      expect(element.childNodes[0].nodeValue).toBe('456');
    });

    describe('nesting', () => {
      test('static child', () => {
        const element = document.createElement('div');
        const result = initElement(element, [
          initElement(document.createElement('p'), ['Hi!']),
        ]);

        expect(result).toBe(element);
        expect(result.attributes.length).toBe(0);
        expect(result.childNodes.length).toBe(1);

        expect(result.outerHTML).toBe('<div><p>Hi!</p></div>');
      });

      test('child with updater', () => {
        let count = 0;
        const element = document.createElement('div');
        const result = initElement(element, [
          initElement(document.createElement('p'), [() => ++count]),
        ]);

        expect(result).toBeInstanceOf(Component);
        expect(result.getElement()).toBe(element);
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);

        expect(element.outerHTML).toBe('<div><p>1</p></div>');

        result.update();

        expect(element.outerHTML).toBe('<div><p>2</p></div>');

        result.update();

        expect(element.outerHTML).toBe('<div><p>3</p></div>');

        result.update();

        expect(element.outerHTML).toBe('<div><p>4</p></div>');
      });

      describe('switch children', () => {
        let child: any = initElement(document.createElement('p'), ['Hi!']);
        const element = document.createElement('div');
        const result = initElement(element, [() => child]);

        expect(result).toBeInstanceOf(Component);
        expect(result.getElement()).toBe(element);
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        expect(element.childNodes[0]).toBe(child);

        const one = initElement(document.createElement('h1'), ['one']);
        const two = initElement(document.createElement('h2'), ['two']);

        test.each([
          ['aaa'],
          [one],
          [two],
          [two],
          ['111'],
          [initElement(document.createElement('p'), ['Hello!'])],
          [initElement(document.createElement('p'), [() => 'Hello!'])],
          [one],
          [one],
          ['bbb'],
          ['bbb'],
          [two],
          ['last'],
        ])('child %p toBe %p', val => {
          child = val;
          result.update();

          if (val instanceof Element) expect(element.childNodes[0]).toBe(val);
          else if (val instanceof Component)
            expect(element.childNodes[0]).toBe(val.getElement());
          else expect(element.childNodes[0].nodeValue).toBe(val);
        });
      });

      test('children with updaters', () => {
        let count = 0;
        const element = document.createElement('div');
        const result = initElement(element, [
          initElement(document.createElement('p'), [() => ++count]),
          ' ',
          initElement(document.createElement('p'), [
            () => initElement(document.createElement('span'), [() => ++count]),
          ]),
        ]);

        expect(result).toBeInstanceOf(Component);
        expect(result.getElement()).toBe(element);
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(3);

        expect(element.outerHTML).toBe(
          '<div><p>1</p> <p><span>2</span></p></div>',
        );

        result.update();

        expect(element.outerHTML).toBe(
          '<div><p>3</p> <p><span>4</span></p></div>',
        );

        result.update();

        expect(element.outerHTML).toBe(
          '<div><p>5</p> <p><span>6</span></p></div>',
        );
      });

      test.each([
        ['aaa', 'aaa'],
        [111, '111'],
        [initElement(document.createElement('p'), ['one']), '<p>one</p>'],
        [initElement(document.createElement('p'), [() => 'two']), '<p>two</p>'],
        [
          () => initElement(document.createElement('p'), ['three']),
          '<p>three</p>',
        ],
        [
          () => initElement(document.createElement('p'), [() => 'four']),
          '<p>four</p>',
        ],
        ['bbb', 'bbb'],
        ['bbb', 'bbb'],
      ])('random child %p toBe %p', (provided, expected) => {
        const element = document.createElement('div');
        const result = initElement(element, [provided]);

        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);

        if (typeof provided === 'function' || provided instanceof Component) {
          expect(result).toBeInstanceOf(Component);
          expect(result.getElement()).toBe(element);
        } else {
          expect(result).toBe(element);
        }

        expect(element.innerHTML).toBe(expected);
      });
    });
  });

  test('div with dynamic prop and child', () => {
    let title = 'aaa';
    let child = 123;
    const element = document.createElement('div');
    const result = initElement(element, [{title: () => title}, () => child]);

    expect(result).toBeInstanceOf(Component);
    expect(result.getElement()).toBe(element);

    expect(element.attributes.length).toBe(1);
    expect(element.childNodes.length).toBe(1);
    expect(element.title).toBe('aaa');
    expect(element.childNodes[0].nodeValue).toBe('123');

    title = 'bbb';
    child = 456;
    result.update();

    expect(element.attributes.length).toBe(1);
    expect(element.childNodes.length).toBe(1);
    expect(element.title).toBe('bbb');
    expect(element.childNodes[0].nodeValue).toBe('456');
  });

  // todo
  // test('custom component can return different types of values', () => {
  //   const custom = (v: any) => {
  //     switch (v) {
  //       case 'div':
  //         return initElement(document.createElement('div'),[]);
  //       case 'p':
  //         return initElement(document.createElement('p'),[]);
  //       case 'fun':
  //         return () => 'fun';
  //       case 'text':
  //         return 'text';
  //       case 'num':
  //         return 123;
  //     }
  //   };
  // });
});
// todo refactor end

test('init multiple static children from array', () => {
  const element = document.createElement('div');
  const result = initElement(element, [
    'one',
    [111, 'aaa', 333],
    'two',
    [],
    ['three'],
  ]);

  expect(result).toBe(element);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(6);
  expect(element.childNodes[0].nodeValue).toBe('one');
  expect(element.childNodes[1].nodeValue).toBe('111');
  expect(element.childNodes[2].nodeValue).toBe('aaa');
  expect(element.childNodes[3].nodeValue).toBe('333');
  expect(element.childNodes[4].nodeValue).toBe('two');
  expect(element.childNodes[5].nodeValue).toBe('three');
});

test('init multiple children from array', () => {
  const element = document.createElement('div');
  const result = initElement(element, [
    [111, () => 'dynamic', () => [1, 2, 3]],
  ]);

  expect(result).toBeInstanceOf(Component);
  expect(result.getElement()).toBe(element);
  expect(element.attributes.length).toBe(0);
  expect(element.childNodes.length).toBe(3);
  expect(element.childNodes[0].nodeValue).toBe('111');
  expect(element.childNodes[1].nodeValue).toBe('dynamic');
  expect(element.childNodes[2].nodeValue).toBe('[1,2,3]'); // todo dynamic array updater
});

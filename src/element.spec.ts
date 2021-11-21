import {initElement} from './element';

describe('initElement', () => {

  test('empty div', () => {
    const element = document.createElement('div');
    const result = initElement(element);
    expect(result).toBe(element);
    expect(result.attributes.length).toBe(0);
    expect(result.childNodes.length).toBe(0);
  });

  describe('props', () => {

    test('div with three static props', () => {
      const element = document.createElement('div');
      const result = initElement(element, {title: 'hello', hidden: true, custom: 123});// [1, 2, 3]});
      expect(result).toBe(element);
      expect(result.attributes.length).toBe(2);
      expect(result.childNodes.length).toBe(0);
      expect(result.title).toBe('hello');
      expect(result.hidden).toBe(true);
      expect(result['custom' as 'id']).toEqual(123); //[1, 2, 3]); // ? should we support arrays
    });

    // todo types check
    // test('element with event props should be static', () => {
    //   const element = document.createElement('button');
    //   const result = initElement(element, {onclick: () => {}});
    //   expect(result).toBe(element);
    //   expect(result.attributes.length).toBe(1);
    //   expect(result.childNodes.length).toBe(0);
    // });

    test('button with two static props objects overrides', () => {
      const element = document.createElement('button');
      const result = initElement(element, {type: 'button', hidden: true}, {type: 'submit', class: 'btn'});
      expect(result).toBe(element);
      expect(result.attributes.length).toBe(3);
      expect(result.childNodes.length).toBe(0);
      expect(result.type).toBe('submit');
      expect(result.hidden).toBe(true);
      expect(result.className).toBe('btn');
    });

    test('button with two dynamic props objects overrides', () => {
      const element = document.createElement('button');
      const result = initElement(element, {type: () => 'button'}, {type: () => 'submit'});
      expect(typeof result).toBe('function');
      expect(element.attributes.length).toBe(0);
      expect(element.childNodes.length).toBe(0);

      expect(result()).toBe(element);
      expect(element.attributes.length).toBe(1);
      expect(element.childNodes.length).toBe(0);
      expect(element.type).toBe('submit');

      expect(result().type).toBe('submit'); // check typings
    });

    test('div with dynamic prop', () => {
      let title = 'aaa';
      const element = document.createElement('div');
      const result = initElement(element, {title: () => title});
      expect(typeof result).toBe('function');
      expect(element.attributes.length).toBe(0);
      expect(element.childNodes.length).toBe(0);
      expect(element.title).toBe('');

      expect(result()).toBe(element);
      expect(element.attributes.length).toBe(1);
      expect(element.title).toBe('aaa');

      title = 'bbb';

      expect(result()).toBe(element);
      expect(element.attributes.length).toBe(1);
      expect(element.title).toBe('bbb');

      expect(result().title).toBe('bbb'); // check typings
    });

  });

  describe('children', () => {

    test('div with falsy child', () => {
      const element = document.createElement('div');
      const result = initElement(element, undefined);
      expect(result).toBe(element);
      expect(result.attributes.length).toBe(0);
      expect(result.childNodes.length).toBe(1);
      expect(result.childNodes[0].nodeValue).toBe('undefined');
    });

    test('div with three static children', () => {
      const element = document.createElement('div');
      const result = initElement(element, 'one', 2, 'three');
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
      const result = initElement(element, () => child);
      expect(typeof result).toBe('function');
      expect(element.attributes.length).toBe(0);
      expect(element.childNodes.length).toBe(1);
      expect(element.childNodes[0].nodeValue).toBe('');

      expect(result()).toBe(element);
      expect(element.childNodes[0].nodeValue).toBe('123');

      child = 456;

      expect(result()).toBe(element);
      expect(element.childNodes[0].nodeValue).toBe('456');

      expect(result().childNodes[0].nodeValue).toBe('456'); // check typings
    });

    describe('nesting', () => {

      test('static child', () => {
        const element = document.createElement('div');
        const result = initElement(element, initElement(document.createElement('p'), 'Hi!'));
        expect(result).toBe(element);
        expect(result.attributes.length).toBe(0);
        expect(result.childNodes.length).toBe(1);
        expect(result.outerHTML).toBe('<div><p>Hi!</p></div>');
      });

      test('child with updater', () => {
        let count = 0;
        const element = document.createElement('div');
        const result = initElement(element, initElement(document.createElement('p'), () => ++ count));
        expect(typeof result).toBe('function');
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        expect(element.outerHTML).toBe('<div></div>');

        expect(result()).toBe(element);
        expect(element.outerHTML).toBe('<div><p>1</p></div>');

        expect(result()).toBe(element);
        expect(element.outerHTML).toBe('<div><p>2</p></div>');

        expect(result()).toBe(element);
        expect(element.outerHTML).toBe('<div><p>3</p></div>');

        expect(result().outerHTML).toBe('<div><p>4</p></div>'); // check typings
      });

      describe('switch children', () => {

        let child: any = initElement(document.createElement('p'), 'Hi!');
        const element = document.createElement('div');
        const result = initElement(element, () => child);
        expect(typeof result).toBe('function');
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        expect(element.innerHTML).toBe('');

        expect(result()).toBe(element);
        expect(element.childNodes[0]).toBe(child);

        const one = initElement(document.createElement('h1'), 'one');
        const two = initElement(document.createElement('h2'), 'two');

        test.each([
          ['aaa'],
          [one],
          [two],
          [two],
          ['111'],
          [initElement(document.createElement('p'), 'Hello!')],
          [one],
          [one],
          ['bbb'],
          ['bbb'],
          [two],
        ])('child %p toBe %p', val => {
          child = val;
          expect(result()).toBe(element);
          if (val instanceof Element) expect(element.childNodes[0]).toBe(val);
          else expect(element.childNodes[0].nodeValue).toBe(val);
        });

        child = 'last'
        expect(result().childNodes[0].nodeValue).toBe('last'); // check typings
      });

      test('children with updaters', () => {
        let count = 0;
        const element = document.createElement('div');
        const result = initElement(element,
          initElement(document.createElement('p'), () => ++ count), ' ',
            initElement(document.createElement('p'), () => ++ count)
        );
        expect(typeof result).toBe('function');
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(3);
        expect(element.outerHTML).toBe('<div> </div>');

        expect(result()).toBe(element);
        expect(element.outerHTML).toBe('<div><p>1</p> <p>2</p></div>');

        expect(result()).toBe(element);
        expect(element.outerHTML).toBe('<div><p>3</p> <p>4</p></div>');

        expect(result()).toBe(element);
        expect(element.outerHTML).toBe('<div><p>5</p> <p>6</p></div>');

        expect(result().outerHTML).toBe('<div><p>7</p> <p>8</p></div>'); // check typings
      });

      test.each([
        ['aaa', 'aaa'],
        [111, '111'],
        [initElement(document.createElement('p'), 'one'), '<p>one</p>'],
        [initElement(document.createElement('p'), () => 'two'), '<p>two</p>'],
        [() => initElement(document.createElement('p'), 'three'), '<p>three</p>'],
        [() => initElement(document.createElement('p'), () => 'four'), '<p>four</p>'],
        ['bbb', 'bbb'],
        ['bbb', 'bbb'],
      ])('random child %p toBe %p', (provided, expected: any) => {
        const element = document.createElement('div');
        const result = initElement(element, provided);
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        if (typeof provided === 'function') {
          expect(typeof result).toBe('function');
          expect(result()).toBe(element);
        }
        else {
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
    const result = initElement(element, {title: () => title}, () => child);
    expect(typeof result).toBe('function');
    expect(element.attributes.length).toBe(0);
    expect(element.childNodes.length).toBe(1);
    expect(element.title).toBe('');
    expect(element.childNodes[0].nodeValue).toBe('');

    expect(result()).toBe(element);
    expect(element.attributes.length).toBe(1);
    expect(element.childNodes.length).toBe(1);
    expect(element.title).toBe('aaa');
    expect(element.childNodes[0].nodeValue).toBe('123');

    title = 'bbb';
    child = 456;

    expect(result()).toBe(element);
    expect(element.attributes.length).toBe(1);
    expect(element.childNodes.length).toBe(1);
    expect(element.title).toBe('bbb');
    expect(element.childNodes[0].nodeValue).toBe('456');

    expect(result().title).toBe('bbb'); // check typings
    expect(result().childNodes[0].nodeValue).toBe('456'); // check typings
  });

  test('custom component can return different types of values', () => {
    const custom = (v: any) => {
      switch (v) {
        case 'div': return initElement(document.createElement('div'));
        case 'p': return initElement(document.createElement('p'));
        case 'fun': return () => 'fun';
        case 'text': return 'text';
        case 'num': return 123;
      }
    };

    // todo tests
  });

});

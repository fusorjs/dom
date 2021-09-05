import {Component} from './types';
import {htmlComponent, svgComponent} from './component';

describe('htmlComponent', () => {

  test('empty div', () => {
    const {element, update} = htmlComponent('div');
    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(update).toBeUndefined();
    expect(element.attributes.length).toBe(0);
    expect(element.childNodes.length).toBe(0);
  });

  describe('props', () => {

    test('div with three static props', () => {
      const {element, update} = htmlComponent('div', {title: 'hello', hidden: true, custom: [1, 2, 3]});
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(update).toBeUndefined();
      expect(element.attributes.length).toBe(2);
      expect(element.childNodes.length).toBe(0);
      expect(element.title).toBe('hello');
      expect(element.hidden).toBe(true);
      expect(element['custom' as 'id']).toEqual([1, 2, 3]);
    });

    test('div with dynamic prop', () => {
      let title = 'aaa';
      const {element, update} = htmlComponent('div', {title: () => title});
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(typeof update).toBe('function');
      expect(element.attributes.length).toBe(1);
      expect(element.childNodes.length).toBe(0);
      expect(element.title).toBe('aaa');
      title = 'bbb';
      update!();
      expect(element.title).toBe('bbb');
    });

  });

  describe('children', () => {

    test('div with falsy child', () => {
      const {element, update} = htmlComponent('div', undefined);
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(update).toBeUndefined();
      expect(element.attributes.length).toBe(0);
      expect(element.childNodes.length).toBe(1);
      expect(element.childNodes[0].nodeValue).toBe('undefined');
    });

    test('div with three static children', () => {
      const {element, update} = htmlComponent('div', 'one', 2, 'three');
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(update).toBeUndefined();
      expect(element.attributes.length).toBe(0);
      expect(element.childNodes.length).toBe(3);
      expect(element.childNodes[0].nodeValue).toBe('one');
      expect(element.childNodes[1].nodeValue).toBe('2');
      expect(element.childNodes[2].nodeValue).toBe('three');
    });

    test('div with dynamic child', () => {
      let child = 123;
      const {element, update} = htmlComponent('div', () => child);
      expect(element).toBeInstanceOf(HTMLDivElement);
      expect(typeof update).toBe('function');
      expect(element.attributes.length).toBe(0);
      expect(element.childNodes.length).toBe(1);
      expect(element.childNodes[0].nodeValue).toBe('123');
      child = 456;
      update!();
      expect(element.childNodes[0].nodeValue).toBe('456');
    });

    describe('nesting', () => {

      test('static child', () => {
        const {element, update} = htmlComponent('div', htmlComponent('p', 'Hi!'));
        expect(element).toBeInstanceOf(HTMLDivElement);
        expect(update).toBeUndefined();
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        expect(element.outerHTML).toBe('<div><p>Hi!</p></div>');
      });

      test('child with updater', () => {
        let count = 0;
        const {element, update} = htmlComponent('div', htmlComponent('p', () => ++ count));
        expect(element).toBeInstanceOf(HTMLDivElement);
        expect(typeof update).toBe('function');
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        expect(element.outerHTML).toBe('<div><p>1</p></div>');
        update!();
        expect(element.outerHTML).toBe('<div><p>2</p></div>');
        update!();
        expect(element.outerHTML).toBe('<div><p>3</p></div>');
      });

      // todo dynamic nested child
      describe('switch children', () => {

        let child = htmlComponent('p', 'Hi!');
        const {element, update} = htmlComponent('div', () => child);
        expect(element).toBeInstanceOf(HTMLDivElement);
        expect(typeof update).toBe('function');
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        const one = htmlComponent('p', 'one');
        const two = htmlComponent('p', () => 'two');
        test.each([
          ['aaa'],
          [one],
          [two],
          [two],
          ['111'],
          [htmlComponent('p', 'Hello!')],
          [one],
          [one],
          ['bbb'],
          ['bbb'],
          [two],
        ])('child %p toBe %p', (val: any) => {
          child = val;
          update!();
          if (val instanceof Component) expect(element.childNodes[0]).toBe(val.element);
          else expect(element.childNodes[0].nodeValue).toBe(val);
        });

      });

      test('children with updaters', () => {
        let count = 0;
        const {element, update} = htmlComponent(
          'div', htmlComponent('p', () => ++ count), ' ', htmlComponent('p', () => ++ count)
        );
        expect(element).toBeInstanceOf(HTMLDivElement);
        expect(typeof update).toBe('function');
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(3);
        expect(element.outerHTML).toBe('<div><p>1</p> <p>2</p></div>');
        update!();
        expect(element.outerHTML).toBe('<div><p>3</p> <p>4</p></div>');
        update!();
        expect(element.outerHTML).toBe('<div><p>5</p> <p>6</p></div>');
      });

      test.each([
        ['aaa', 'aaa'],
        [111, '111'],
        [htmlComponent('p', 'one'), '<p>one</p>'],
        [htmlComponent('p', () => 'two'), '<p>two</p>'],
        [() => htmlComponent('p', 'three'), '<p>three</p>'],
        [() => htmlComponent('p', () => 'four'), '<p>four</p>'],
        ['bbb', 'bbb'],
        ['bbb', 'bbb'],
      ])('random child %p toBe %p', (provided: any, expected: any) => {
        const {element, update} = htmlComponent('div', provided);
        expect(element).toBeInstanceOf(HTMLDivElement);
        expect(element.attributes.length).toBe(0);
        expect(element.childNodes.length).toBe(1);
        expect(element.innerHTML).toBe(expected);
        update?.();
        expect(element.innerHTML).toBe(expected);
      });

    });

  });

  test('div with dynamic prop and child', () => {
    let title = 'aaa';
    let child = 123;
    const {element, update} = htmlComponent('div', {title: () => title}, () => child);
    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(typeof update).toBe('function');
    expect(element.attributes.length).toBe(1);
    expect(element.childNodes.length).toBe(1);
    expect(element.title).toBe('aaa');
    expect(element.childNodes[0].nodeValue).toBe('123');
    title = 'bbb';
    child = 456;
    update!();
    expect(element.title).toBe('bbb');
    expect(element.childNodes[0].nodeValue).toBe('456');
  });

});

describe('svgComponent', () => {

  test('empty svg', () => {
    const {element, update} = svgComponent('svgComponent');
    expect(element).toBeInstanceOf(SVGElement);
    expect(update).toBeUndefined();
    expect(element.attributes.length).toBe(0);
    expect(element.childNodes.length).toBe(0);
  });

});

describe('dynamic from POC', () => {

  // 01.singleton

  test('stateless button changes global counter onclick', () => {
    let counter = 0;

    const {element, update} = htmlComponent(
      'button',
      {onclick: () => {
        counter += 1;
        update!();
      }},
      () => `Clicked ${counter} times!`
    );

    expect(element).toBeInstanceOf(HTMLButtonElement);
    expect(typeof update).toBe('function');
    expect(element.innerHTML).toBe('Clicked 0 times!');

    element.click();

    expect(element.innerHTML).toBe('Clicked 1 times!');

    element.click();
    element.click();

    expect(element.innerHTML).toBe('Clicked 3 times!');
  });

  // 02.multiple

  test('stateful counter button instances are clicked', () => {
    const CounterButton = (counter = 0) => {
      let component: Component<HTMLElement>;

      const {update} = component = htmlComponent(
        'button',
        {onclick: () => {
          counter += 1;
          update!();
        }},
        () => `Clicked ${counter} times!`
      );

      return component;
    };

    const {element: element1} = CounterButton();
    const {element: element2} = CounterButton();
    const {element: element3} = CounterButton(333);

    expect(element1.innerHTML).toBe('Clicked 0 times!');
    expect(element2.innerHTML).toBe('Clicked 0 times!');
    expect(element3.innerHTML).toBe('Clicked 333 times!');

    element1.click();

    element2.click();
    element2.click();

    element3.click();
    element3.click();
    element3.click();

    expect(element1.innerHTML).toBe('Clicked 1 times!');
    expect(element2.innerHTML).toBe('Clicked 2 times!');
    expect(element3.innerHTML).toBe('Clicked 336 times!');
  });

  // 03.props

  test('set color style of text', () => {
    expect(
      htmlComponent('p', {style: 'color:red'}, 'This text is red colored.').element.outerHTML
    ).toBe(
      '<p style="color: red;">This text is red colored.</p>'
    );
  });

  // 04.child

  test('toggle button color', () => {
    let toggle = false;

    const {element: toggleElement, update: toggleUpdate} = htmlComponent(
      'button',
      {
        onclick: () => {
          toggle = ! toggle;
          toggleUpdate!();
        }
      },
      () => toggle ? 'On' : 'Off',
    );

    let counter = 0;

    const {element: counterElement, update: counterUpdate} = htmlComponent(
      'button',
      {
        onclick: () => {
          counter += 1;
          counterUpdate!();
        },
        style: () => toggle ? 'color:green' : ''
      },
      () => `Clicked ${counter} times!`
    );

    expect(toggleElement.innerHTML).toBe('Off');
    expect(counterElement.outerHTML).toBe('<button style="">Clicked 0 times!</button>');

    counterElement.click();
    counterElement.click();

    expect(counterElement.outerHTML).toBe('<button style="">Clicked 2 times!</button>');

    toggleElement.click();
    counterElement.click();
    counterElement.click();
    counterElement.click();

    expect(toggleElement.innerHTML).toBe('On');
    expect(counterElement.outerHTML).toBe('<button style="color: green;">Clicked 5 times!</button>');

    toggleElement.click();
    counterElement.click();

    expect(toggleElement.innerHTML).toBe('Off');
    expect(counterElement.outerHTML).toBe('<button style="">Clicked 6 times!</button>');

    toggleElement.click();

    expect(toggleElement.innerHTML).toBe('On');
  });

});

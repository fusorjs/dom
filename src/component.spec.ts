import {component as h} from './component';

describe('component', () => {

  test('empty div', () => {
    const render = h('div');
    expect(typeof render).toBe('function');
    const element = render();
    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(element.attributes.length).toBe(0);
    expect(element.childNodes.length).toBe(0);
  });

  test('static div with 3 props', () => {
    const render = h('div', {title: 'hello', hidden: true, custom: [1, 2, 3]});
    expect(typeof render).toBe('function');
    const element = render();
    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(element.attributes.length).toBe(2);
    expect(element.childNodes.length).toBe(0);
    expect(element.title).toBe('hello');
    expect(element.hidden).toBe(true);
    expect(element['custom' as 'id']).toEqual([1, 2, 3]);
  });

  test('div with dynamic prop', () => {
    let title = 0;
    const render = h('div', {title: () => title});
    const element = render();
    expect(element.title).toBe('0');
    title = 1;
    render();
    expect(element.title).toBe('1');
  });

  test('static div with 3 children', () => {
    const render = h('div', 'one', 2, 'three');
    expect(typeof render).toBe('function');
    const element = render();
    expect(element).toBeInstanceOf(HTMLDivElement);
    expect(element.attributes.length).toBe(0);
    expect(element.childNodes.length).toBe(3);
    expect(element.childNodes[0].nodeValue).toBe('one');
    expect(element.childNodes[1].nodeValue).toBe('2');
    expect(element.childNodes[2].nodeValue).toBe('three');
  });

  test('div with dynamic child', () => {
    let title = 0;
    const render = h('div', () => title);
    const element = render();
    expect(element.childNodes[0].nodeValue).toBe('0');
    title = 1;
    render();
    expect(element.childNodes[0].nodeValue).toBe('1');
  });

  describe('dynamic from POC', () => {

    // 01.singleton

    test('stateless button changes global counter onclick', () => {
      let counter = 0;

      const render = h(
        'button',
        {onclick: () => {
          counter += 1;
          render();
        }},
        () => `Clicked ${counter} times!`
      );

      const buttonElement = render();

      expect(buttonElement.innerHTML).toBe('Clicked 0 times!');

      buttonElement.click();

      expect(buttonElement.innerHTML).toBe('Clicked 1 times!');

      buttonElement.click();
      buttonElement.click();

      expect(buttonElement.innerHTML).toBe('Clicked 3 times!');
    });

    // 02.multiple

    test('stateful counter button instances are clicked', () => {
      const counterButton = (counter = 0) => {
        const render = h(
          'button',
          {onclick: () => {
            counter += 1;
            render();
          }},
          () => `Clicked ${counter} times!`
        );

        return render;
      };

      const buttonElement1 = counterButton()();
      const buttonElement2 = counterButton()();
      const buttonElement3 = counterButton(333)();

      expect(buttonElement1.innerHTML).toBe('Clicked 0 times!');
      expect(buttonElement2.innerHTML).toBe('Clicked 0 times!');
      expect(buttonElement3.innerHTML).toBe('Clicked 333 times!');

      buttonElement1.click();

      buttonElement2.click();
      buttonElement2.click();

      buttonElement3.click();
      buttonElement3.click();
      buttonElement3.click();

      expect(buttonElement1.innerHTML).toBe('Clicked 1 times!');
      expect(buttonElement2.innerHTML).toBe('Clicked 2 times!');
      expect(buttonElement3.innerHTML).toBe('Clicked 336 times!');
    });

    // 03.props

    test('set color style of text', () => {
      expect(
        h('p', {style: 'color:red'}, 'This text is red colored.')().outerHTML
      ).toBe(
        '<p style="color: red;">This text is red colored.</p>'
      );
    });

    // 04.child

    test('toggle button color', () => {
      let toggle = false;

      const toggleRender = h(
        'button',
        {
          onclick: () => {
            toggle = ! toggle;
            toggleRender();
          }
        },
        () => toggle ? 'On' : 'Off',
      );

      const toggleElement = toggleRender();

      let counter = 0;

      const counterRender = h(
        'button',
        {
          onclick: () => {
            counter += 1;
            counterRender();
          },
          style: () => toggle ? 'color:green' : ''
        },
        () => `Clicked ${counter} times!`
      );

      const counterElement = counterRender();

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

});

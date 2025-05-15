import {getElement, jsx, update} from '..';
import {Component} from '../component';

describe('dynamic children array', () => {
  test('replace only its previous values', () => {
    let value: any = [111, 222, 333];
    const component = <div>AAA{() => value}BBB</div>;
    const element = getElement(component);
    expect(element.innerHTML).toBe('AAA111222333BBB');

    value = [11, 22];
    update(component);
    expect(element.innerHTML).toBe('AAA1122BBB');

    value = [1, 2, 3, 4];
    update(component);
    expect(element.innerHTML).toBe('AAA1234BBB');

    value = 'abc';
    update(component);
    expect(element.innerHTML).toBe('AAAabcBBB');

    value = '---';
    update(component);
    expect(element.innerHTML).toBe('AAA---BBB');

    value = ['aa', 'bb'];
    update(component);
    expect(element.innerHTML).toBe('AAAaabbBBB');

    value = [];
    update(component);
    expect(element.innerHTML).toBe('AAABBB');

    value = [111, 222, 333];
    update(component);
    expect(element.innerHTML).toBe('AAA111222333BBB');

    value = [11, 22];
    update(component);
    expect(element.innerHTML).toBe('AAA1122BBB');
  });

  test('replace only its previous values', () => {
    let left: any;
    let center: any;
    let right: any;

    const component = (
      <div>
        {() => left}
        {() => center}
        {() => right}
      </div>
    );
    const element = getElement(component);

    expect(element.innerHTML).toBe('');

    center = ['|'];
    update(component);
    expect(element.innerHTML).toBe('|');

    left = ['('];
    update(component);
    expect(element.innerHTML).toBe('(|');

    right = [')'];
    update(component);
    expect(element.innerHTML).toBe('(|)');

    left = [];
    center = [];
    update(component);
    expect(element.innerHTML).toBe(')');

    center = ['|'];
    update(component);
    expect(element.innerHTML).toBe('|)');

    left = ['(', '('];
    center = [];
    right = [')', ')'];
    update(component);
    expect(element.innerHTML).toBe('(())');

    center = ['|', '|'];
    update(component);
    expect(element.innerHTML).toBe('((||))');
  });

  test('dynamic array executes function children', () => {
    let count = 0;
    const component = <div>{() => [...Array(5)].map(() => ++count + '-')}</div>;
    const element = getElement(component);

    expect(element.innerHTML).toBe('1-2-3-4-5-');

    update(component);

    expect(element.innerHTML).toBe('6-7-8-9-10-');
  });

  {
    const getTestCases = (
      description: string,
      v1: any,
      v2: any,
      v3: any,
      v4: any,
      convert = (i: any) =>
        i instanceof Element
          ? i.outerHTML
          : i instanceof Component
            ? i.element.outerHTML
            : String(i),
    ) =>
      [
        [v1, v2, v3],
        [v1, v3],
        [v2],
        [v3, v2, v1],
        [v1, v2, v3],
        v1,
        [v1, v2, v3],
        v2,
        [v1, v2, v3],
        [v1, v2],
        [v2, v3],
        [v1, v2],
        [v2, v1],
        [v1, v2],
        [v1],
        [v2],
        [v1],
        v1,
        [v1, v2, v3, v4],
        [v4, v3, v2, v1],
        [v1, v4, v3, v2],
        [v4, v3, v2, v1],
        [v4, v3],
        [v1, v2],
        [v1, v2, v3, v4],
        [v3, v4, v1, v2],
        [v1, v2, v3, v4],
        [v4, v1, v2],
        [v2, v4, v3],
        [v3, v2],
      ].map((i) => [
        description,
        i,
        Array.isArray(i) ? i.map(convert).join('') : convert(i),
      ]);

    let children: any;
    const component = <div>{() => children}</div>;

    test.each([
      ...getTestCases('value', 1, 2, 3, 4),
      ...getTestCases('node', <p>1</p>, <p>2</p>, <p>3</p>, <p>4</p>),
      ...getTestCases(
        'component',
        <p>{() => 1}</p>,
        <p>{() => 2}</p>,
        <p>{() => 3}</p>,
        <p>{() => 3}</p>,
      ),
    ])('change same %p to %p %p', (description, provided, expected) => {
      children = provided;
      update(component);
      expect(getElement(component).innerHTML).toBe(expected);
    });
  }

  // ? maybe not flatten dynamic nested arrays
  test.skip('flatten nested arrays', () => {
    let value = [111, ['AAA', ['---'], 'BBB'], 222];
    const component = (<div>{() => value}</div>) as Component<Element>;

    expect(component.element.innerHTML).toBe('111AAA---BBB222');

    // value = [11, 22];
    // update(component);

    // expect(component.element.innerHTML).toBe('AAA1122BBB');
  });
});

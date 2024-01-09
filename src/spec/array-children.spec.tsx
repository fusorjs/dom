import {Component, jsx} from '..';

describe('dynamic children', () => {
  test('replace only its previous values', () => {
    let value: any = [111, 222, 333];
    const component = (<div>AAA{() => value}BBB</div>) as Component<Element>;
    expect(component.element.innerHTML).toBe('AAA111222333BBB');

    value = [11, 22];
    component.update();
    expect(component.element.innerHTML).toBe('AAA1122BBB');

    value = [1, 2, 3, 4];
    component.update();
    expect(component.element.innerHTML).toBe('AAA1234BBB');

    value = 'abc';
    component.update();
    expect(component.element.innerHTML).toBe('AAAabcBBB');

    value = '---';
    component.update();
    expect(component.element.innerHTML).toBe('AAA---BBB');

    value = ['aa', 'bb'];
    component.update();
    expect(component.element.innerHTML).toBe('AAAaabbBBB');

    value = [];
    component.update();
    expect(component.element.innerHTML).toBe('AAABBB');

    value = [111, 222, 333];
    component.update();
    expect(component.element.innerHTML).toBe('AAA111222333BBB');

    value = [11, 22];
    component.update();
    expect(component.element.innerHTML).toBe('AAA1122BBB');
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
    ) as Component<Element>;

    expect(component.element.innerHTML).toBe('');

    center = ['|'];
    component.update();
    expect(component.element.innerHTML).toBe('|');

    left = ['('];
    component.update();
    expect(component.element.innerHTML).toBe('(|');

    right = [')'];
    component.update();
    expect(component.element.innerHTML).toBe('(|)');

    left = [];
    center = [];
    component.update();
    expect(component.element.innerHTML).toBe(')');

    center = ['|'];
    component.update();
    expect(component.element.innerHTML).toBe('|)');

    left = ['(', '('];
    center = [];
    right = [')', ')'];
    component.update();
    expect(component.element.innerHTML).toBe('(())');

    center = ['|', '|'];
    component.update();
    expect(component.element.innerHTML).toBe('((||))');
  });

  test('dynamic array executes function children', () => {
    let count = 0;
    const component = (
      <div>{() => [...Array(5)].map(() => ++count + '-')}</div>
    ) as Component<Element>;

    expect(component.element.innerHTML).toBe('1-2-3-4-5-');

    component.update();

    expect(component.element.innerHTML).toBe('6-7-8-9-10-');
  });

  // ? maybe not flatten dynamic nested arrays
  test.skip('flatten nested arrays', () => {
    let value = [111, ['AAA', ['---'], 'BBB'], 222];
    const component = (<div>{() => value}</div>) as Component<Element>;

    expect(component.element.innerHTML).toBe('111AAA---BBB222');

    // value = [11, 22];
    // component.update();

    // expect(component.element.innerHTML).toBe('AAA1122BBB');
  });
});

import {jsx, h, getElement} from '..';
import {Fusion, StaticArg, StaticChild} from '../types';

describe('children wrapper', () => {
  const IdiomaticJsx = ({children}: {children?: StaticChild}) => {
    return <idiomatic-jsx>{children}</idiomatic-jsx>;
  };

  const CompatibleJsx = (...args: StaticArg[]) => {
    const arg0 = args[0] as any;
    return (
      <compatible-jsx>
        {arg0?.constructor === Object && arg0.children ? arg0.children : args}
      </compatible-jsx>
    );
  };

  const IdiomaticFn = (...children: any[]) => {
    return h('idiomatic-fn', ...children);
  };

  const CompatibleFn = (...args: any[]) => {
    return h('compatible-fn', ...args);
  };

  test.each<[Fusion, string]>([
    // idiomatic jsx component
    [
      <jsx>
        <IdiomaticJsx>AAA{111}</IdiomaticJsx>
      </jsx>,
      '<jsx><idiomatic-jsx>AAA111</idiomatic-jsx></jsx>',
    ],
    [
      h('fn', IdiomaticJsx({children: ['AAA', 111]})),
      '<fn><idiomatic-jsx>AAA111</idiomatic-jsx></fn>',
      // ! children defined in props
    ],

    // compatible jsx component
    [
      <jsx>
        <CompatibleJsx>AAA{111}</CompatibleJsx>
      </jsx>,
      '<jsx><compatible-jsx>AAA111</compatible-jsx></jsx>',
    ],
    [
      h('fn', CompatibleJsx('AAA', 111)),
      '<fn><compatible-jsx>AAA111</compatible-jsx></fn>',
    ],

    // idiomatic fn component
    [
      h('fn', IdiomaticFn('AAA', 111)),
      '<fn><idiomatic-fn>AAA111</idiomatic-fn></fn>',
    ],
    [
      <jsx>
        <IdiomaticFn>AAA{111}</IdiomaticFn>
      </jsx>,
      '<jsx><idiomatic-fn>AAA111</idiomatic-fn></jsx>',
      // ! children are not allowed in typescript
      // it works bacause of {children} jsx support in props in initFn()
    ],

    // compatible fn component
    [
      h('fn', CompatibleFn('AAA', 111)),
      '<fn><compatible-fn>AAA111</compatible-fn></fn>',
    ],
    [
      <jsx>
        <CompatibleFn>AAA{111}</CompatibleFn>
      </jsx>,
      '<jsx><compatible-fn>AAA111</compatible-fn></jsx>',
    ],
  ])('%p %p', (provided, expected) => {
    expect(getElement(provided).outerHTML).toBe(expected);
  });
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'compatible-jsx': unknown;
      'idiomatic-jsx': unknown;
      jsx: unknown;
    }
  }
}

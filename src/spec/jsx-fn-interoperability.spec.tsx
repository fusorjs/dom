import {jsx, h} from '..';
import {StaticArg, StaticChild} from '../types';

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

  const IdiomaticFn = (...children: StaticChild[]) => {
    return h('idiomatic-fn', ...children);
  };

  const CompatibleFn = (...args: StaticArg[]) => {
    return h('compatible-fn', ...args);
  };

  test.each(
    // prettier-ignore
    [
      // idiomatic jsx component
      [
        (<jsx><IdiomaticJsx>AAA{111}</IdiomaticJsx></jsx>) as Element,
        '<jsx><idiomatic-jsx>AAA111</idiomatic-jsx></jsx>',
      ],
      [
        h('fn', IdiomaticJsx({children: ['AAA', 111]}) as Element),
        '<fn><idiomatic-jsx>AAA111</idiomatic-jsx></fn>',
        // ! children defined in props
      ],

      // compatible jsx component
      [
        (<jsx><CompatibleJsx>AAA{111}</CompatibleJsx></jsx>) as Element,
        '<jsx><compatible-jsx>AAA111</compatible-jsx></jsx>',
      ],
      [
        h('fn', CompatibleJsx('AAA', 111) as Element),
        '<fn><compatible-jsx>AAA111</compatible-jsx></fn>',
      ],

      // idiomatic fn component
      [
        h('fn', IdiomaticFn('AAA', 111)),
        '<fn><idiomatic-fn>AAA111</idiomatic-fn></fn>',
      ],
      [
        // @ts-ignore
        (<jsx><IdiomaticFn>AAA{111}</IdiomaticFn></jsx>) as Element,
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
        (<jsx><CompatibleFn>AAA{111}</CompatibleFn></jsx>) as Element,
        '<jsx><compatible-fn>AAA111</compatible-fn></jsx>',
      ]
    ],
  )('%p %p', (element, html) => {
    expect(element.outerHTML).toBe(html);
  });
});

import {Fusion, JsxFactory, JsxImportSource, NameSpace, Props} from './types';
import {init} from './init';
import {
  mathMlNamespace,
  mathMlTagNames,
  svgNamespace,
  svgTagNames,
} from './help/constants';
import {createElement} from './createElement';

// <https://dev.to/afl_ext/how-to-render-jsx-to-whatever-you-want-with-a-custom-jsx-renderer-cjk>
// <https://dev.to/devsmitra/how-to-create-the-app-using-jsx-without-react-k08>
// <https://www.typescriptlang.org/docs/handbook/jsx.html>
// <https://preactjs.com/guide/v10/getting-started/> <https://github.com/preactjs/preact>
// <https://github.com/itsjavi/jsx-runtime>
// <https://stackoverflow.com/questions/41557309/typescript-jsx-without-react>

// <https://babeljs.io/docs/babel-plugin-transform-react-jsx>
// <https://github.com/babel/babel/tree/main/packages/babel-plugin-transform-react-jsx>

interface MyIntrinsicElements {
  [tagName: string]: Props;
}

declare global {
  namespace JSX {
    type Element = Fusion;
    type IntrinsicElements = MyIntrinsicElements;
  }
}

export declare namespace jsxFactory {
  namespace JSX {
    type Element = Fusion;
    type IntrinsicElements = MyIntrinsicElements;
  }
}

/** jsxFactory implementation */
export const jsxFactory: JsxFactory = (tag, params, ...children) => {
  // todo check `key` property, and props can contain `children`
  // console.log('initJsx', tag, params, ...children);
  // if (children.length > 0) throw new Error('CHILDREN > 0');

  return jsxImportSource(tag, {...params, children}); // todo remove unnecessary object creation
};

/** jsxImportSource implementation */
const jsxImportSource: JsxImportSource = (tag, params, key) => {
  // console.log('jsxImportSource', tag, params, key);

  // User Components
  if (typeof tag === 'function') return tag(params);

  const namespace =
    (params?.xmlns as NameSpace) ??
    // todo check the performance of Array.includes vs Set.has vs if/switch
    (svgTagNamesSet.has(tag)
      ? svgNamespace
      : mathMlTagNamesSet.has(tag)
        ? mathMlNamespace
        : undefined);

  const element = createElement(tag, namespace, params);

  return init(element, key === undefined ? [params] : [params, {key}]); // todo remove unnecessary array creation
};

export {
  jsxImportSource as jsx,
  jsxImportSource as jsxs,
  jsxImportSource as jsxDEV,
};

// SVG

const svgTagRename: {[k in (typeof svgTagNames)[number]]?: string} = {
  a: 'sa',
  script: 'sscript',
  style: 'sstyle',
  title: 'stitle',
};

export const svgTagNamesSet = new Set(
  svgTagNames.map((tag) => svgTagRename[tag] ?? tag),
);

// MathML

export const mathMlTagNamesSet = new Set<string>(
  mathMlTagNames.map((tag) => tag),
);

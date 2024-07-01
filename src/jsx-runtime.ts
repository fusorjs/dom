import {Fusion, InitJsx, Props} from './types';
import {init} from './init';
import {htmlTagNames, svgNamespace, svgTagNames} from './help/constants';
import {createElement} from './createElement';

// <https://dev.to/afl_ext/how-to-render-jsx-to-whatever-you-want-with-a-custom-jsx-renderer-cjk>
// <https://dev.to/devsmitra/how-to-create-the-app-using-jsx-without-react-k08>
// <https://www.typescriptlang.org/docs/handbook/jsx.html>
// <https://preactjs.com/guide/v10/getting-started/> <https://github.com/preactjs/preact>
// <https://github.com/itsjavi/jsx-runtime>
// <https://stackoverflow.com/questions/41557309/typescript-jsx-without-react>

interface MyIntrinsicElements {
  [tagName: string]: Props;
}

declare global {
  namespace JSX {
    type Element = Fusion;
    type IntrinsicElements = MyIntrinsicElements;
  }
}

export declare namespace initJsx {
  namespace JSX {
    type Element = Fusion;
    type IntrinsicElements = MyIntrinsicElements;
  }
}

// todo optimize & refactor
export const initJsx: InitJsx = (tagName, props, ...children) => {
  if (typeof tagName === 'function') {
    return tagName({...props, children});
  }

  const isSvgTag = svgTagNamesSet.has(tagName);
  const element = createElement(
    isSvgTag ? svgNamespace : undefined,
    tagName,
    props,
  );

  return init(element, [props, ...children]);
};

export const jsx = initJsx;
export const jsxs = initJsx;
export const jsxDEV = initJsx;

// Exclude<keyof SVGElementTagNameMap, keyof HTMLElementTagNameMap>
// todo optimize loops and maybe includes (maybe use Sets in constants)
const svgTagNamesSet = new Set(
  svgTagNames.map((tagName) => {
    if (htmlTagNames.includes(tagName as keyof HTMLElementTagNameMap)) {
      const newTagName = 's' + tagName;

      if (htmlTagNames.includes(newTagName as keyof HTMLElementTagNameMap))
        throw new Error(
          `svg tag names are used in html: ${tagName}, ${newTagName}`,
        );

      // sa, sscript, sstyle, stitle,
      // console.log(newTagName);

      return newTagName;
    }

    return tagName;
  }),
);

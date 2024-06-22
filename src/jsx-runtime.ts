import {JsxInitter, Props} from './types';
import {Component} from './component';
import {init} from './init';
import {htmlTagNames, svgNamespace, svgTagNames} from './help/constants';
import {createElement} from './createElement';

// <https://dev.to/afl_ext/how-to-render-jsx-to-whatever-you-want-with-a-custom-jsx-renderer-cjk>
// <https://dev.to/devsmitra/how-to-create-the-app-using-jsx-without-react-k08>
// <https://www.typescriptlang.org/docs/handbook/jsx.html>
// <https://preactjs.com/guide/v10/getting-started/> <https://github.com/preactjs/preact>
// <https://github.com/itsjavi/jsx-runtime>
// <https://stackoverflow.com/questions/41557309/typescript-jsx-without-react>

type MyElement = Element;

interface MyIntrinsicElements {
  // todo is: string;
  // todo mount: string;
  [tagName: string]: Props;
}

declare global {
  namespace JSX {
    type Element = MyElement | Component<MyElement>;
    type IntrinsicElements = MyIntrinsicElements;
  }
}

export declare namespace initJsx {
  namespace JSX {
    type Element = MyElement | Component<MyElement>;
    type IntrinsicElements = MyIntrinsicElements;
  }
}

// todo optimize & refactor
export const initJsx: JsxInitter<Element> = (tagName, props, ...children) => {
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

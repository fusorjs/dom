import {JsxInitter, Props} from './types';
import {Component} from './component';
import {initFn} from './initFn';
import {htmlTagNames, svgNamespace, svgTagNames} from './help/constants';

// todo optimize & refactor
export const initJsx: JsxInitter<Element> = (tagName, props, ...children) => {
  if (typeof tagName === 'function') {
    return tagName({...props, children});
  }

  const is = props?.is;
  let options: ElementCreationOptions | undefined;

  if (typeof is === 'string') options = {is};

  const element = svgTagNamesSet.has(tagName)
    ? document.createElementNS(svgNamespace, tagName, options)
    : document.createElement(tagName, options);

  return initFn(element, [props, ...children]);
};

type DomElement = Element;

export declare namespace initJsx {
  namespace JSX {
    type Element = DomElement | Component<DomElement>;

    interface IntrinsicElements {
      [tagName: string]: Props;
    }
  }
}

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

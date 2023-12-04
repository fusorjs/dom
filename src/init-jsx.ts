import {JsxInitter, Props} from './types';
import {Component} from './component';
import {initFn} from './initFn';
import {htmlTagNames, svgNamespace, svgTagNames} from './help/constants';
import {initElement} from './init-element';

type DomElement = Element;

export declare namespace initJsx {
  namespace JSX {
    type Element = DomElement | Component<DomElement>;

    interface IntrinsicElements {
      // todo is: string;
      // todo mount: string;
      [tagName: string]: Props;
    }
  }
}

// todo optimize & refactor
export const initJsx: JsxInitter<Element> = (tagName, props, ...children) => {
  if (typeof tagName === 'function') {
    return tagName({...props, children});
  }

  const isSvgTag = svgTagNamesSet.has(tagName);
  const element = initElement(
    isSvgTag ? svgNamespace : undefined,
    tagName,
    props,
  );

  return initFn(element, [props, ...children]);
};

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

import {
  XMLInitter,
  TagName,
  HyperNotation,
  AllHTMLElementTagNameMap,
} from './types';
import {createElement} from './createElement';
import {init} from './init';

import {svgNamespace, mathMlNamespace} from './help/constants';

// todo x ///
/** Create namespaced XML component */
export const initHelper: XMLInitter = (namespace, tagName, args) => {
  const [props] = args as any;
  const element = createElement(
    tagName,
    namespace,
    props?.constructor === Object ? props : undefined,
  );

  return init(element, args) as any;
};

/** Create HTML component */
export const h: HyperNotation<
  AllHTMLElementTagNameMap & {[key: string]: HTMLElement}
> = (tag, ...args) => initHelper(undefined, tag as TagName, args) as any;

// const xxx = h('br');

/** Create SVG component */
export const s: HyperNotation<
  SVGElementTagNameMap & {[key: string]: SVGElement}
> = (tagName, ...args) =>
  initHelper(svgNamespace, tagName as TagName, args) as any;

/** Create MathML component */
export const m: HyperNotation<
  MathMLElementTagNameMap & {[key: string]: MathMLElement}
> = (tagName, ...args) =>
  initHelper(mathMlNamespace, tagName as TagName, args) as any;

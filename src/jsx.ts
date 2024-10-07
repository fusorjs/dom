import {Fusion, JsxFactory, JsxImportSource, NameSpace, Params} from './types';
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

// Types

declare global {
  // todo checkout:
  // https://www.totaltypescript.com/tips/typescript-5-1-beta-is-out
  // export type ElementType =
  // export type ClassElement =
  // export interface IntrinsicAttributes {}

  namespace JSX {
    type Element = Fusion;

    // <HTMLElementTagNameMap>
    interface IntrinsicElements {
      a: Params<HTMLAnchorElement>;
      abbr: Params<HTMLElement>;
      address: Params<HTMLElement>;
      area: Params<HTMLAreaElement>;
      article: Params<HTMLElement>;
      aside: Params<HTMLElement>;
      audio: Params<HTMLAudioElement>;
      b: Params<HTMLElement>;
      base: Params<HTMLBaseElement>;
      bdi: Params<HTMLElement>;
      bdo: Params<HTMLElement>;
      blockquote: Params<HTMLQuoteElement>;
      body: Params<HTMLBodyElement>;
      br: Params<HTMLBRElement>;
      button: Params<HTMLButtonElement>;
      canvas: Params<HTMLCanvasElement>;
      caption: Params<HTMLTableCaptionElement>;
      cite: Params<HTMLElement>;
      code: Params<HTMLElement>;
      col: Params<HTMLTableColElement>;
      colgroup: Params<HTMLTableColElement>;
      data: Params<HTMLDataElement>;
      datalist: Params<HTMLDataListElement>;
      dd: Params<HTMLElement>;
      del: Params<HTMLModElement>;
      details: Params<HTMLDetailsElement>;
      dfn: Params<HTMLElement>;
      dialog: Params<HTMLDialogElement>;
      div: Params<HTMLDivElement>;
      dl: Params<HTMLDListElement>;
      dt: Params<HTMLElement>;
      em: Params<HTMLElement>;
      embed: Params<HTMLEmbedElement>;
      fieldset: Params<HTMLFieldSetElement>;
      figcaption: Params<HTMLElement>;
      figure: Params<HTMLElement>;
      footer: Params<HTMLElement>;
      form: Params<HTMLFormElement>;
      h1: Params<HTMLHeadingElement>;
      h2: Params<HTMLHeadingElement>;
      h3: Params<HTMLHeadingElement>;
      h4: Params<HTMLHeadingElement>;
      h5: Params<HTMLHeadingElement>;
      h6: Params<HTMLHeadingElement>;
      head: Params<HTMLHeadElement>;
      header: Params<HTMLElement>;
      hgroup: Params<HTMLElement>;
      hr: Params<HTMLHRElement>;
      html: Params<HTMLHtmlElement>;
      i: Params<HTMLElement>;
      iframe: Params<HTMLIFrameElement>;
      img: Params<HTMLImageElement>;
      input: Params<HTMLInputElement>;
      ins: Params<HTMLModElement>;
      kbd: Params<HTMLElement>;
      label: Params<HTMLLabelElement>;
      legend: Params<HTMLLegendElement>;
      li: Params<HTMLLIElement>;
      link: Params<HTMLLinkElement>;
      main: Params<HTMLElement>;
      map: Params<HTMLMapElement>;
      mark: Params<HTMLElement>;
      menu: Params<HTMLMenuElement>;
      meta: Params<HTMLMetaElement>;
      meter: Params<HTMLMeterElement>;
      nav: Params<HTMLElement>;
      noscript: Params<HTMLElement>;
      object: Params<HTMLObjectElement>;
      ol: Params<HTMLOListElement>;
      optgroup: Params<HTMLOptGroupElement>;
      option: Params<HTMLOptionElement>;
      output: Params<HTMLOutputElement>;
      p: Params<HTMLParagraphElement>;
      picture: Params<HTMLPictureElement>;
      pre: Params<HTMLPreElement>;
      progress: Params<HTMLProgressElement>;
      q: Params<HTMLQuoteElement>;
      rp: Params<HTMLElement>;
      rt: Params<HTMLElement>;
      ruby: Params<HTMLElement>;
      s: Params<HTMLElement>;
      samp: Params<HTMLElement>;
      script: Params<HTMLScriptElement>;
      search: Params<HTMLElement>;
      section: Params<HTMLElement>;
      select: Params<HTMLSelectElement>;
      slot: Params<HTMLSlotElement>;
      small: Params<HTMLElement>;
      source: Params<HTMLSourceElement>;
      span: Params<HTMLSpanElement>;
      strong: Params<HTMLElement>;
      style: Params<HTMLStyleElement>;
      sub: Params<HTMLElement>;
      summary: Params<HTMLElement>;
      sup: Params<HTMLElement>;
      table: Params<HTMLTableElement>;
      tbody: Params<HTMLTableSectionElement>;
      td: Params<HTMLTableCellElement>;
      template: Params<HTMLTemplateElement>;
      textarea: Params<HTMLTextAreaElement>;
      tfoot: Params<HTMLTableSectionElement>;
      th: Params<HTMLTableCellElement>;
      thead: Params<HTMLTableSectionElement>;
      time: Params<HTMLTimeElement>;
      title: Params<HTMLTitleElement>;
      tr: Params<HTMLTableRowElement>;
      track: Params<HTMLTrackElement>;
      u: Params<HTMLElement>;
      ul: Params<HTMLUListElement>;
      var: Params<HTMLElement>;
      video: Params<HTMLVideoElement>;
      wbr: Params<HTMLElement>;
    }

    // <HTMLElementDeprecatedTagNameMap>
    interface IntrinsicElements {
      acronym: Params<HTMLElement>;
      applet: Params<HTMLUnknownElement>;
      basefont: Params<HTMLElement>;
      bgsound: Params<HTMLUnknownElement>;
      big: Params<HTMLElement>;
      blink: Params<HTMLUnknownElement>;
      center: Params<HTMLElement>;
      dir: Params<HTMLDirectoryElement>;
      font: Params<HTMLFontElement>;
      frame: Params<HTMLFrameElement>;
      frameset: Params<HTMLFrameSetElement>;
      isindex: Params<HTMLUnknownElement>;
      keygen: Params<HTMLUnknownElement>;
      listing: Params<HTMLPreElement>;
      marquee: Params<HTMLMarqueeElement>;
      menuitem: Params<HTMLElement>;
      multicol: Params<HTMLUnknownElement>;
      nextid: Params<HTMLUnknownElement>;
      nobr: Params<HTMLElement>;
      noembed: Params<HTMLElement>;
      noframes: Params<HTMLElement>;
      param: Params<HTMLParamElement>;
      plaintext: Params<HTMLElement>;
      rb: Params<HTMLElement>;
      rtc: Params<HTMLElement>;
      spacer: Params<HTMLUnknownElement>;
      strike: Params<HTMLElement>;
      tt: Params<HTMLElement>;
      xmp: Params<HTMLPreElement>;
    }

    // <SVGElementTagNameMap>
    interface IntrinsicElements {
      sa: Params<SVGAElement>;
      animate: Params<SVGAnimateElement>;
      animateMotion: Params<SVGAnimateMotionElement>;
      animateTransform: Params<SVGAnimateTransformElement>;
      circle: Params<SVGCircleElement>;
      clipPath: Params<SVGClipPathElement>;
      defs: Params<SVGDefsElement>;
      desc: Params<SVGDescElement>;
      ellipse: Params<SVGEllipseElement>;
      feBlend: Params<SVGFEBlendElement>;
      feColorMatrix: Params<SVGFEColorMatrixElement>;
      feComponentTransfer: Params<SVGFEComponentTransferElement>;
      feComposite: Params<SVGFECompositeElement>;
      feConvolveMatrix: Params<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: Params<SVGFEDiffuseLightingElement>;
      feDisplacementMap: Params<SVGFEDisplacementMapElement>;
      feDistantLight: Params<SVGFEDistantLightElement>;
      feDropShadow: Params<SVGFEDropShadowElement>;
      feFlood: Params<SVGFEFloodElement>;
      feFuncA: Params<SVGFEFuncAElement>;
      feFuncB: Params<SVGFEFuncBElement>;
      feFuncG: Params<SVGFEFuncGElement>;
      feFuncR: Params<SVGFEFuncRElement>;
      feGaussianBlur: Params<SVGFEGaussianBlurElement>;
      feImage: Params<SVGFEImageElement>;
      feMerge: Params<SVGFEMergeElement>;
      feMergeNode: Params<SVGFEMergeNodeElement>;
      feMorphology: Params<SVGFEMorphologyElement>;
      feOffset: Params<SVGFEOffsetElement>;
      fePointLight: Params<SVGFEPointLightElement>;
      feSpecularLighting: Params<SVGFESpecularLightingElement>;
      feSpotLight: Params<SVGFESpotLightElement>;
      feTile: Params<SVGFETileElement>;
      feTurbulence: Params<SVGFETurbulenceElement>;
      filter: Params<SVGFilterElement>;
      foreignObject: Params<SVGForeignObjectElement>;
      g: Params<SVGGElement>;
      image: Params<SVGImageElement>;
      line: Params<SVGLineElement>;
      linearGradient: Params<SVGLinearGradientElement>;
      marker: Params<SVGMarkerElement>;
      mask: Params<SVGMaskElement>;
      metadata: Params<SVGMetadataElement>;
      mpath: Params<SVGMPathElement>;
      path: Params<SVGPathElement>;
      pattern: Params<SVGPatternElement>;
      polygon: Params<SVGPolygonElement>;
      polyline: Params<SVGPolylineElement>;
      radialGradient: Params<SVGRadialGradientElement>;
      rect: Params<SVGRectElement>;
      sscript: Params<SVGScriptElement>;
      set: Params<SVGSetElement>;
      stop: Params<SVGStopElement>;
      sstyle: Params<SVGStyleElement>;
      svg: Params<SVGSVGElement>;
      switch: Params<SVGSwitchElement>;
      symbol: Params<SVGSymbolElement>;
      text: Params<SVGTextElement>;
      textPath: Params<SVGTextPathElement>;
      stitle: Params<SVGTitleElement>;
      tspan: Params<SVGTSpanElement>;
      use: Params<SVGUseElement>;
      view: Params<SVGViewElement>;
    }

    // <MathMLElementTagNameMap>
    interface IntrinsicElements {
      annotation: Params<MathMLElement>;
      'annotation-xml': Params<MathMLElement>;
      maction: Params<MathMLElement>;
      math: Params<MathMLElement>;
      merror: Params<MathMLElement>;
      mfrac: Params<MathMLElement>;
      mi: Params<MathMLElement>;
      mmultiscripts: Params<MathMLElement>;
      mn: Params<MathMLElement>;
      mo: Params<MathMLElement>;
      mover: Params<MathMLElement>;
      mpadded: Params<MathMLElement>;
      mphantom: Params<MathMLElement>;
      mprescripts: Params<MathMLElement>;
      mroot: Params<MathMLElement>;
      mrow: Params<MathMLElement>;
      ms: Params<MathMLElement>;
      mspace: Params<MathMLElement>;
      msqrt: Params<MathMLElement>;
      mstyle: Params<MathMLElement>;
      msub: Params<MathMLElement>;
      msubsup: Params<MathMLElement>;
      msup: Params<MathMLElement>;
      mtable: Params<MathMLElement>;
      mtd: Params<MathMLElement>;
      mtext: Params<MathMLElement>;
      mtr: Params<MathMLElement>;
      munder: Params<MathMLElement>;
      munderover: Params<MathMLElement>;
      semantics: Params<MathMLElement>;
    }

    // default
    // interface IntrinsicElements {
    //   [key: string]: Params<Element>;
    // }
  }
}

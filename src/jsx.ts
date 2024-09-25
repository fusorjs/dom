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
  namespace JSX {
    type Element = Fusion;

    // <HTMLElementTagNameMap>
    interface IntrinsicElements {
      a: Props<HTMLAnchorElement>;
      abbr: Props<HTMLElement>;
      address: Props<HTMLElement>;
      area: Props<HTMLAreaElement>;
      article: Props<HTMLElement>;
      aside: Props<HTMLElement>;
      audio: Props<HTMLAudioElement>;
      b: Props<HTMLElement>;
      base: Props<HTMLBaseElement>;
      bdi: Props<HTMLElement>;
      bdo: Props<HTMLElement>;
      blockquote: Props<HTMLQuoteElement>;
      body: Props<HTMLBodyElement>;
      br: Props<HTMLBRElement>;
      button: Props<HTMLButtonElement>;
      canvas: Props<HTMLCanvasElement>;
      caption: Props<HTMLTableCaptionElement>;
      cite: Props<HTMLElement>;
      code: Props<HTMLElement>;
      col: Props<HTMLTableColElement>;
      colgroup: Props<HTMLTableColElement>;
      data: Props<HTMLDataElement>;
      datalist: Props<HTMLDataListElement>;
      dd: Props<HTMLElement>;
      del: Props<HTMLModElement>;
      details: Props<HTMLDetailsElement>;
      dfn: Props<HTMLElement>;
      dialog: Props<HTMLDialogElement>;
      div: Props<HTMLDivElement>;
      dl: Props<HTMLDListElement>;
      dt: Props<HTMLElement>;
      em: Props<HTMLElement>;
      embed: Props<HTMLEmbedElement>;
      fieldset: Props<HTMLFieldSetElement>;
      figcaption: Props<HTMLElement>;
      figure: Props<HTMLElement>;
      footer: Props<HTMLElement>;
      form: Props<HTMLFormElement>;
      h1: Props<HTMLHeadingElement>;
      h2: Props<HTMLHeadingElement>;
      h3: Props<HTMLHeadingElement>;
      h4: Props<HTMLHeadingElement>;
      h5: Props<HTMLHeadingElement>;
      h6: Props<HTMLHeadingElement>;
      head: Props<HTMLHeadElement>;
      header: Props<HTMLElement>;
      hgroup: Props<HTMLElement>;
      hr: Props<HTMLHRElement>;
      html: Props<HTMLHtmlElement>;
      i: Props<HTMLElement>;
      iframe: Props<HTMLIFrameElement>;
      img: Props<HTMLImageElement>;
      input: Props<HTMLInputElement>;
      ins: Props<HTMLModElement>;
      kbd: Props<HTMLElement>;
      label: Props<HTMLLabelElement>;
      legend: Props<HTMLLegendElement>;
      li: Props<HTMLLIElement>;
      link: Props<HTMLLinkElement>;
      main: Props<HTMLElement>;
      map: Props<HTMLMapElement>;
      mark: Props<HTMLElement>;
      menu: Props<HTMLMenuElement>;
      meta: Props<HTMLMetaElement>;
      meter: Props<HTMLMeterElement>;
      nav: Props<HTMLElement>;
      noscript: Props<HTMLElement>;
      object: Props<HTMLObjectElement>;
      ol: Props<HTMLOListElement>;
      optgroup: Props<HTMLOptGroupElement>;
      option: Props<HTMLOptionElement>;
      output: Props<HTMLOutputElement>;
      p: Props<HTMLParagraphElement>;
      picture: Props<HTMLPictureElement>;
      pre: Props<HTMLPreElement>;
      progress: Props<HTMLProgressElement>;
      q: Props<HTMLQuoteElement>;
      rp: Props<HTMLElement>;
      rt: Props<HTMLElement>;
      ruby: Props<HTMLElement>;
      s: Props<HTMLElement>;
      samp: Props<HTMLElement>;
      script: Props<HTMLScriptElement>;
      search: Props<HTMLElement>;
      section: Props<HTMLElement>;
      select: Props<HTMLSelectElement>;
      slot: Props<HTMLSlotElement>;
      small: Props<HTMLElement>;
      source: Props<HTMLSourceElement>;
      span: Props<HTMLSpanElement>;
      strong: Props<HTMLElement>;
      style: Props<HTMLStyleElement>;
      sub: Props<HTMLElement>;
      summary: Props<HTMLElement>;
      sup: Props<HTMLElement>;
      table: Props<HTMLTableElement>;
      tbody: Props<HTMLTableSectionElement>;
      td: Props<HTMLTableCellElement>;
      template: Props<HTMLTemplateElement>;
      textarea: Props<HTMLTextAreaElement>;
      tfoot: Props<HTMLTableSectionElement>;
      th: Props<HTMLTableCellElement>;
      thead: Props<HTMLTableSectionElement>;
      time: Props<HTMLTimeElement>;
      title: Props<HTMLTitleElement>;
      tr: Props<HTMLTableRowElement>;
      track: Props<HTMLTrackElement>;
      u: Props<HTMLElement>;
      ul: Props<HTMLUListElement>;
      var: Props<HTMLElement>;
      video: Props<HTMLVideoElement>;
      wbr: Props<HTMLElement>;
    }

    // <HTMLElementDeprecatedTagNameMap>
    interface IntrinsicElements {
      acronym: Props<HTMLElement>;
      applet: Props<HTMLUnknownElement>;
      basefont: Props<HTMLElement>;
      bgsound: Props<HTMLUnknownElement>;
      big: Props<HTMLElement>;
      blink: Props<HTMLUnknownElement>;
      center: Props<HTMLElement>;
      dir: Props<HTMLDirectoryElement>;
      font: Props<HTMLFontElement>;
      frame: Props<HTMLFrameElement>;
      frameset: Props<HTMLFrameSetElement>;
      isindex: Props<HTMLUnknownElement>;
      keygen: Props<HTMLUnknownElement>;
      listing: Props<HTMLPreElement>;
      marquee: Props<HTMLMarqueeElement>;
      menuitem: Props<HTMLElement>;
      multicol: Props<HTMLUnknownElement>;
      nextid: Props<HTMLUnknownElement>;
      nobr: Props<HTMLElement>;
      noembed: Props<HTMLElement>;
      noframes: Props<HTMLElement>;
      param: Props<HTMLParamElement>;
      plaintext: Props<HTMLElement>;
      rb: Props<HTMLElement>;
      rtc: Props<HTMLElement>;
      spacer: Props<HTMLUnknownElement>;
      strike: Props<HTMLElement>;
      tt: Props<HTMLElement>;
      xmp: Props<HTMLPreElement>;
    }

    // <SVGElementTagNameMap>
    interface IntrinsicElements {
      sa: Props<SVGAElement>;
      animate: Props<SVGAnimateElement>;
      animateMotion: Props<SVGAnimateMotionElement>;
      animateTransform: Props<SVGAnimateTransformElement>;
      circle: Props<SVGCircleElement>;
      clipPath: Props<SVGClipPathElement>;
      defs: Props<SVGDefsElement>;
      desc: Props<SVGDescElement>;
      ellipse: Props<SVGEllipseElement>;
      feBlend: Props<SVGFEBlendElement>;
      feColorMatrix: Props<SVGFEColorMatrixElement>;
      feComponentTransfer: Props<SVGFEComponentTransferElement>;
      feComposite: Props<SVGFECompositeElement>;
      feConvolveMatrix: Props<SVGFEConvolveMatrixElement>;
      feDiffuseLighting: Props<SVGFEDiffuseLightingElement>;
      feDisplacementMap: Props<SVGFEDisplacementMapElement>;
      feDistantLight: Props<SVGFEDistantLightElement>;
      feDropShadow: Props<SVGFEDropShadowElement>;
      feFlood: Props<SVGFEFloodElement>;
      feFuncA: Props<SVGFEFuncAElement>;
      feFuncB: Props<SVGFEFuncBElement>;
      feFuncG: Props<SVGFEFuncGElement>;
      feFuncR: Props<SVGFEFuncRElement>;
      feGaussianBlur: Props<SVGFEGaussianBlurElement>;
      feImage: Props<SVGFEImageElement>;
      feMerge: Props<SVGFEMergeElement>;
      feMergeNode: Props<SVGFEMergeNodeElement>;
      feMorphology: Props<SVGFEMorphologyElement>;
      feOffset: Props<SVGFEOffsetElement>;
      fePointLight: Props<SVGFEPointLightElement>;
      feSpecularLighting: Props<SVGFESpecularLightingElement>;
      feSpotLight: Props<SVGFESpotLightElement>;
      feTile: Props<SVGFETileElement>;
      feTurbulence: Props<SVGFETurbulenceElement>;
      filter: Props<SVGFilterElement>;
      foreignObject: Props<SVGForeignObjectElement>;
      g: Props<SVGGElement>;
      image: Props<SVGImageElement>;
      line: Props<SVGLineElement>;
      linearGradient: Props<SVGLinearGradientElement>;
      marker: Props<SVGMarkerElement>;
      mask: Props<SVGMaskElement>;
      metadata: Props<SVGMetadataElement>;
      mpath: Props<SVGMPathElement>;
      path: Props<SVGPathElement>;
      pattern: Props<SVGPatternElement>;
      polygon: Props<SVGPolygonElement>;
      polyline: Props<SVGPolylineElement>;
      radialGradient: Props<SVGRadialGradientElement>;
      rect: Props<SVGRectElement>;
      sscript: Props<SVGScriptElement>;
      set: Props<SVGSetElement>;
      stop: Props<SVGStopElement>;
      sstyle: Props<SVGStyleElement>;
      svg: Props<SVGSVGElement>;
      switch: Props<SVGSwitchElement>;
      symbol: Props<SVGSymbolElement>;
      text: Props<SVGTextElement>;
      textPath: Props<SVGTextPathElement>;
      stitle: Props<SVGTitleElement>;
      tspan: Props<SVGTSpanElement>;
      use: Props<SVGUseElement>;
      view: Props<SVGViewElement>;
    }

    // <MathMLElementTagNameMap>
    interface IntrinsicElements {
      annotation: Props<MathMLElement>;
      'annotation-xml': Props<MathMLElement>;
      maction: Props<MathMLElement>;
      math: Props<MathMLElement>;
      merror: Props<MathMLElement>;
      mfrac: Props<MathMLElement>;
      mi: Props<MathMLElement>;
      mmultiscripts: Props<MathMLElement>;
      mn: Props<MathMLElement>;
      mo: Props<MathMLElement>;
      mover: Props<MathMLElement>;
      mpadded: Props<MathMLElement>;
      mphantom: Props<MathMLElement>;
      mprescripts: Props<MathMLElement>;
      mroot: Props<MathMLElement>;
      mrow: Props<MathMLElement>;
      ms: Props<MathMLElement>;
      mspace: Props<MathMLElement>;
      msqrt: Props<MathMLElement>;
      mstyle: Props<MathMLElement>;
      msub: Props<MathMLElement>;
      msubsup: Props<MathMLElement>;
      msup: Props<MathMLElement>;
      mtable: Props<MathMLElement>;
      mtd: Props<MathMLElement>;
      mtext: Props<MathMLElement>;
      mtr: Props<MathMLElement>;
      munder: Props<MathMLElement>;
      munderover: Props<MathMLElement>;
      semantics: Props<MathMLElement>;
    }
  }
}

import {CustomCreator, TaggedCreator} from '../types';

import {createElement, getTaggedCreator, getTaggedCreatorMap} from './create';

export const svgNamespace = 'http://www.w3.org/2000/svg';

export const s: CustomCreator<SVGElement> = (tagName, ...args) =>
  createElement(svgNamespace, tagName, args) as any;

type Result = {
  [K in keyof SVGElementTagNameMap]: TaggedCreator<SVGElementTagNameMap[K]>;
};

export const {
  a,
  animate,
  animateMotion,
  animateTransform,
  circle,
  clipPath,
  defs,
  desc,
  ellipse,
  feBlend,
  feColorMatrix,
  feComponentTransfer,
  feComposite,
  feConvolveMatrix,
  feDiffuseLighting,
  feDisplacementMap,
  feDistantLight,
  feDropShadow,
  feFlood,
  feFuncA,
  feFuncB,
  feFuncG,
  feFuncR,
  feGaussianBlur,
  feImage,
  feMerge,
  feMergeNode,
  feMorphology,
  feOffset,
  fePointLight,
  feSpecularLighting,
  feSpotLight,
  feTile,
  feTurbulence,
  filter,
  foreignObject,
  g,
  image,
  line,
  linearGradient,
  marker,
  mask,
  metadata,
  mpath,
  path,
  pattern,
  polygon,
  polyline,
  radialGradient,
  rect,
  script,
  set,
  stop,
  style,
  svg,
  switch: sswitch,
  symbol,
  text,
  textPath,
  title,
  tspan,
  use,
  view,
} = getTaggedCreatorMap<Result, keyof SVGElementTagNameMap>(
  getTaggedCreator(svgNamespace),
  [
    'a',
    'animate',
    'animateMotion',
    'animateTransform',
    'circle',
    'clipPath',
    'defs',
    'desc',
    'ellipse',
    'feBlend',
    'feColorMatrix',
    'feComponentTransfer',
    'feComposite',
    'feConvolveMatrix',
    'feDiffuseLighting',
    'feDisplacementMap',
    'feDistantLight',
    'feDropShadow',
    'feFlood',
    'feFuncA',
    'feFuncB',
    'feFuncG',
    'feFuncR',
    'feGaussianBlur',
    'feImage',
    'feMerge',
    'feMergeNode',
    'feMorphology',
    'feOffset',
    'fePointLight',
    'feSpecularLighting',
    'feSpotLight',
    'feTile',
    'feTurbulence',
    'filter',
    'foreignObject',
    'g',
    'image',
    'line',
    'linearGradient',
    'marker',
    'mask',
    'metadata',
    'mpath',
    'path',
    'pattern',
    'polygon',
    'polyline',
    'radialGradient',
    'rect',
    'script',
    'set',
    'stop',
    'style',
    'svg',
    'switch',
    'symbol',
    'text',
    'textPath',
    'title',
    'tspan',
    'use',
    'view',
  ],
);

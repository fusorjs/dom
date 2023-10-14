import {CustomInitter, TaggedInitter} from '../types';

import {
  initElementHelper,
  getTaggedInitHelper,
  getTaggedInitMapHelper,
} from './init';
import {svgTagNames, svgNamespace} from './constants';

export const s: CustomInitter<SVGElement> = (tagName, ...args) =>
  initElementHelper(svgNamespace, tagName, args) as any;

type Result = {
  [K in keyof SVGElementTagNameMap]: TaggedInitter<SVGElementTagNameMap[K]>;
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
} = getTaggedInitMapHelper<Result, keyof SVGElementTagNameMap>(
  getTaggedInitHelper(svgNamespace),
  svgTagNames,
);

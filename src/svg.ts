import {createTaggedComponents, svgTagNames} from '@perform/common';
import {component} from './component';

export const {
  a, altGlyph, altGlyphDef, altGlyphItem, animate, animateColor,
  animateMotion, animateTransform, animation, audio, canvas,
  circle, clipPath, 'color-profile': colorProfile, cursor, defs, desc, discard,
  ellipse, feBlend, feColorMatrix, feComponentTransfer, feComposite,
  feConvolveMatrix, feDiffuseLighting, feDisplacementMap,
  feDistantLight, feDropShadow, feFlood, feFuncA, feFuncB, feFuncG,
  feFuncR, feGaussianBlur, feImage, feMerge, feMergeNode,
  feMorphology, feOffset, fePointLight, feSpecularLighting,
  feSpotLight, feTile, feTurbulence, filter, font, 'font-face': fontFace,
  'font-face-format': fontFaceFormat, 'font-face-name': fontFaceName,
  'font-face-src': fontFaceSrc, 'font-face-uri': fontFaceUri,
  foreignObject, g, glyph, glyphRef, handler, hatch, hatchpath,
  hkern, iframe, image, line, linearGradient, listener, marker,
  mask, mesh, meshgradient, meshpatch, meshrow, metadata,
  'missing-glyph': missingGlyph, mpath, path, pattern, polygon, polyline,
  prefetch, radialGradient, rect, script, set, solidColor,
  solidcolor, stop, style, svg, symbol, tbreak, text,
  textArea, textPath, title, tref, tspan, unknown, use, video,
  view, vkern,
  // uppercase conflicting names:
  Switch
} = createTaggedComponents(svgTagNames, component);

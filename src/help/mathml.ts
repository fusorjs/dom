import {FunctionalNotation} from '../types';

import {getTaggedInitHelper, getTaggedInitMapHelper} from './share';
import {mathMlTagNames, mathMlNamespace} from './constants';

export const {
  annotation,
  'annotation-xml': annotationXml,
  maction,
  math,
  merror,
  mfrac,
  mi,
  mmultiscripts,
  mn,
  mo,
  mover,
  mpadded,
  mphantom,
  mprescripts,
  mroot,
  mrow,
  ms,
  mspace,
  msqrt,
  mstyle,
  msub,
  msubsup,
  msup,
  mtable,
  mtd,
  mtext,
  mtr,
  munder,
  munderover,
  semantics,
} = getTaggedInitMapHelper<
  {
    [K in keyof MathMLElementTagNameMap]: FunctionalNotation<
      MathMLElementTagNameMap[K]
    >;
  },
  keyof MathMLElementTagNameMap
>(getTaggedInitHelper(mathMlNamespace), mathMlTagNames);

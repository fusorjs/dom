// Public API for library users
export type {Fusion} from './types';
export {getElement, isUpdatable, update} from './public';
export {h, s, m} from './hyper';
export {jsxFactory as jsx} from './jsx';
export {
  defaultPropSplitter,
  setPropSplitter,
  getPropSplitter,
} from './prop/initProp';

// todo deprecate:

export {Component} from './component';

// Public API for library users
export type {Fusion} from './types';
export {getElement, isUpdatable, update} from './public';
export {h, s} from './help/initHelper';
export {initJsx as jsx} from './jsx-runtime';
export {
  defaultPropSplitter,
  setPropSplitter,
  getPropSplitter,
} from './prop/initProp';

// todo deprecate:

export {Component} from './component';

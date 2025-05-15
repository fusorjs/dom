// Public API for library users
export type {Fusion, Params, Mount, Unmount} from './types';
export {getElement, isUpdatable, update} from './public';
export {h, s, m} from './hyper';
export {jsxFactory as jsx} from './jsx';
export {
  defaultParameterSeparator,
  setParameterSeparator,
  getParameterSeparator,
} from './prop/initProp';

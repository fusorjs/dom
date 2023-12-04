import {Component} from './component';

/** use it only for events for performance */
export const elementComponent = new WeakMap<Element, Component<Element>>();

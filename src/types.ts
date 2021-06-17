import {Component} from '@perform/base/types';

export interface DomPropUpdater {
  (): void;
}

export interface DomChildUpdater {
  (element: HTMLElement): void;
}

export interface DomRenderer {
  (): HTMLElement;
}

export type DomComponent = Component<DomRenderer>;

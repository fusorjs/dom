
export interface PropUpdater {
  (): void;
}

export interface ChildUpdater { // ? it is Renderer ?
  (parent: HTMLElement): void;
}

export interface Renderer {
  (): HTMLElement;
}


export interface PropUpdater {
  (): void;
}

export interface ChildUpdater { // ? it is Renderer ?
  (): void;
}

export interface Renderer {
  (): HTMLElement;
}

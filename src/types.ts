
export interface PropUpdater {
  (): void;
}

export interface ChildUpdater {
  (element: HTMLElement): void;
}

export interface Renderer {
  (): HTMLElement;
}

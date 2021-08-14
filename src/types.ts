
export interface PropUpdater {
  (): void;
}

export interface ChildUpdater {
  (parent: HTMLElement): void;
}

export interface Renderer {
  (): HTMLElement;
}

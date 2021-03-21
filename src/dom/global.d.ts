
interface PropUpdater {
  (): void;
}

interface ChildUpdater {
  (element: HTMLElement): void;
}

type DomComponentRenderer = ComponentRenderer<HTMLElement>;

type DomComponentCreator = ComponentCreator<DomComponentRenderer>;

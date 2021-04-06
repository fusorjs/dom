
interface PropUpdater {
  (): void;
}

interface ChildUpdater {
  (element: HTMLElement): void;
}

interface DomComponentRenderer {
  (): HTMLElement;
}

type DomComponentCreator = ComponentCreator<DomComponentRenderer>;

interface DomComponentUpdater <Item> {
  (getItem: Item): ComponentRenderer;
}

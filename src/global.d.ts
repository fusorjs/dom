
interface DomPropUpdater {
  (): void;
}

interface DomChildUpdater {
  (element: HTMLElement): void;
}

interface DomRenderer {
  (): HTMLElement;
}

type DomComponent = Component<DomRenderer>;

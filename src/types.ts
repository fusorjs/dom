
export interface Updater {
  (): void;
}

export class Component <E extends Element> {
  constructor(
    public readonly element: E,
    public readonly update?: Updater,
  ) {}
}

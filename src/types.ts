
/** Prop/Child updater */
export interface Updater {
  (): void;
}

// export type ElementResult <E extends Element> = E | (() => E);

export interface EventT <T extends EventTarget> extends Omit<Event, 'target'> {
  target: T;
}

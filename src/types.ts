
export interface Updater {
  (): void;
}

// ? class Component extends Array & remove marker, check: performance, memory, compatibility
export type ComponentInstance <T extends Element> = readonly [
  element: T,
  update: Updater | undefined,
  __componentMarker: Symbol
];

export const __componentMarker = Symbol();

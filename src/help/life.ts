import {TagName, FunctionalNotation} from '../types';
import {initHelper} from '../hyper';

console.warn(
  '<fusor-life> & `Life` are deprecated in favour of `mount` callback',
);

const connected = new Event('connected');
const disconnected = new Event('disconnected');
const adopted = new Event('adopted');
const attributeChanged = new Event('attributeChanged');

/** @deprecated use mount prop */
customElements.define(
  'fusor-life',

  class extends HTMLElement {
    connectedCallback() {
      this.dispatchEvent(connected);
    }

    disconnectedCallback() {
      this.dispatchEvent(disconnected);
    }

    adoptedCallback() {
      this.dispatchEvent(adopted);
    }

    attributeChangedCallback() {
      this.dispatchEvent(attributeChanged);
    }
  },
);

/** @deprecated use mount prop */
export const Life: FunctionalNotation<HTMLElement> = (...args) =>
  initHelper(undefined, 'fusor-life' as TagName, args) as any;

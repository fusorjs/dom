import {TaggedCreator} from '../types';
import {createElement} from './create';

const connected = new Event('connected');
const disconnected = new Event('disconnected');
const adopted = new Event('adopted');
const attributeChanged = new Event('attributeChanged');

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

export const Life: TaggedCreator<HTMLElement> = (...args) =>
  createElement(undefined, 'fusor-life', args) as any;

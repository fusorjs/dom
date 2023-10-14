import {TaggedInitter} from '../types';
import {initElementHelper} from './init';

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

export const Life: TaggedInitter<HTMLElement> = (...args) =>
  initElementHelper(undefined, 'fusor-life', args) as any;

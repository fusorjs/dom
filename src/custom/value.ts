import {ElementWithExtras} from '../types';

export class CustomValue {
  appendChild(element: ElementWithExtras) {
    throw new Error(`implementation is required`);
  }
}

import {ElementWithExtras} from '../types';
import {PubSubName, subscriptions} from './share';
import {CustomValue} from './value';

type ValueListener<In, Out> = (value: In) => Out;

export class Subscribe<In, Out> extends CustomValue {
  constructor(name: string, listener: ValueListener<In, Out>) {
    super();

    const list = subscriptions.get(name as PubSubName);

    if (list) list.push(this);
    else subscriptions.set(name as PubSubName, [this]);
  }
  appendChild(element: ElementWithExtras) {
    //
  }
}

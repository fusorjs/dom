import {TagPropsChildren, Props, Child} from '@perform/common';

import {Component, Updater} from './types';
import {initProps} from './prop/init';
import {initChildren} from './child/init';

const createComponent = <T extends Element>(
  namespaceURI?: string
) => (
  ...args: TagPropsChildren
): Component<T> => {
  const [tagName, propsOrChild] = args;

  const element = (
    namespaceURI
      ? document.createElementNS(namespaceURI, tagName)
      : document.createElement(tagName)
  ) as T;

  let updaters: Updater[] | undefined;

  if (args.length > 1) {
    let startIndex = 1;

    if (propsOrChild?.constructor === Object) {
      startIndex = 2;

      const propUpdaters = initProps(element, propsOrChild as Props);

      if (propUpdaters) updaters = propUpdaters;
    }

    if (args.length > startIndex) {
      const childUpdaters = initChildren(element, args as Child[], startIndex);

      if (childUpdaters) {
        if (updaters) updaters = updaters.concat(childUpdaters);
        else updaters = childUpdaters;
      }
    }
  }

  return new Component(
    element,
    updaters && (() => {for (const update of updaters!) update();}),
  );
};

export const htmlComponent = createComponent<HTMLElement>();

export const svgComponent = createComponent<SVGElement>('http://www.w3.org/2000/svg');

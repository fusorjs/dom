import {
  ElementWithExtras,
  LifeMount,
  NamespaceUri,
  Props,
  TagName,
} from './types';
import {getLifeElementName} from './getLifeElementName';
import {DEVELOPMENT, elementExtrasName} from './share';

export const createElement = (
  namespace: NamespaceUri | undefined,
  tagName: TagName,
  props?: Props,
) => {
  let element: ElementWithExtras | undefined;
  let options: ElementCreationOptions | undefined;

  const is = props?.is;
  const mount = props?.mount;

  if (DEVELOPMENT) {
    if (typeof is === 'string') options = {is};
    else if (is) throw new TypeError(`not string property "is"`);
  }

  if (mount) {
    if (DEVELOPMENT) {
      if (is)
        throw new TypeError(
          `cannot use both properties together "mount" and "is": ${
            is as ElementCreationOptions['is']
          }`,
        );

      if (namespace)
        throw new TypeError(
          '"mount" property is not allowed in namespace: ' + namespace,
        ); // https://github.com/WICG/webcomponents/issues/634

      if (typeof mount !== 'function')
        throw new TypeError('"mount" property is not a function');
    }

    element = document.createElement(tagName, {
      is: getLifeElementName(tagName),
    });

    element[elementExtrasName] = {
      mount: mount as LifeMount,
    };
  } else {
    element = namespace
      ? document.createElementNS(namespace, tagName, options)
      : document.createElement(tagName, options);
  }

  return element;
};

import {ElementWithExtras, Mount, NameSpace, Params, TagName} from './types';
import {getLifeElementName} from './getLifeElementName';
import {DEVELOPMENT, elementExtrasName} from './share';

// todo props => is, mount
export const createElement = (
  tagName: TagName,
  xmlns?: NameSpace,
  props?: Params,
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
          `cannot use both properties "mount" and "is" together`,
        );

      if (xmlns)
        throw new TypeError(
          '"mount" property is not supported with anything but HTML yet, see the proposal: https://github.com/WICG/webcomponents/issues/634',
        );

      if (typeof mount !== 'function')
        throw new TypeError('"mount" property is not a function');
    }

    element = document.createElement(tagName, {
      is: getLifeElementName(tagName),
    });

    element[elementExtrasName] = {
      mount: mount as Mount,
    };
  } else {
    element = xmlns
      ? document.createElementNS(xmlns, tagName, options)
      : document.createElement(tagName, options);
  }

  return element;
};

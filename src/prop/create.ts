import {Prop, UpdatableProp} from '../types';
import {getPropertyDescriptor, getString} from '../share';

import {convertAttr, emptyAttr} from './share';

export const defaultPropSplitter = '$';

let propSplitter = defaultPropSplitter;

export const setPropSplitter = (s: string) => (propSplitter = s);

const detectProperty = (value: any, name: string) => {
  const d = getPropertyDescriptor(value, name);

  if (d && (d.writable || typeof d.set === 'function')) {
    return true;
  }
};

/**
 * Fusor v2
 * automatic - attr or prop,
 *           - if `preferProp`:`property`|`attribute` is set in Config it will be default
 *           - Otherwise:
 *             - user property if it is defined on the element prototype.
 *             - set as attributes
 * "xlink:href$an$http://www.w3.org/1999/xlink" - attribute
 *
 * property$p
 * attribute$a
 * "xmlns:xlink$a$http://www.w3.org/1999/xlink" - attribute
 * event$e
 * event$e$capture$once$passive
 * or
 * {handle, capture?, once?, passive?, signal?}
 */
export const createProp = (element: Element, key: string, value: Prop) => {
  const split = key.split(propSplitter);
  const {length} = split;
  const [name, type] = split;

  if (!name) throw new TypeError(`empty name in key 1 "${key}"`);

  switch (
    type ??
    // *** AUTOMATIC TYPE ***
    ((typeof value === 'object' && value !== null) ||
    detectProperty(element, name)
      ? 'p'
      : 'a')
  ) {
    // *** PROPERTY TYPE ***
    case 'p':
    case 'ps':
      if (length > 2)
        throw new TypeError(`excess option in property key 2 "${key}"`);

      // dynamic
      if (type !== 'ps' && typeof value === 'function') {
        const val = value();

        element[name as 'id'] = val as any;

        const updatable: UpdatableProp = {
          update: value,
          value: val,
          isAttr: false,
        };

        return updatable;
      }

      // static
      element[name as 'id'] = value as any;

      // todo data-
      // todo style...
      // todo area-
      // todo classList - init

      break;

    // *** ATTRIBUTE TYPE ***
    case 'a':
      if (length > (type === undefined ? 1 : 2))
        throw new TypeError(`excess option in attribute key 2 "${key}"`);
    case 'an':
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
      const namespace =
        split[2] || (element instanceof HTMLElement ? undefined : null);

      if (type === 'an') {
        if (!namespace)
          throw new TypeError(
            `missing namespace option in attribute key 3 "${key}"`,
          );
        else if (length > 3)
          throw new TypeError(`excess option in attribute key 4 "${key}"`);
      }

      // dynamic
      if (typeof value === 'function') {
        const val = convertAttr(value());

        if (val !== emptyAttr) {
          // todo use createAttribute
          if (namespace === undefined) {
            element.setAttribute(
              name,
              typeof val === 'string' ? val : getString(val),
            );
          } else {
            element.setAttributeNS(
              namespace,
              name,
              typeof val === 'string' ? val : getString(val),
            );
          }
        }

        const updatable: UpdatableProp = {
          update: value,
          value: val,
          isAttr: true,
          namespace,
        };

        return updatable;
      }

      // static

      const val = convertAttr(value);

      if (val === emptyAttr) return; // do nothing

      // todo use createAttribute
      if (namespace === undefined) {
        element.setAttribute(
          name,
          typeof val === 'string' ? val : getString(val),
        );
      } else {
        element.setAttributeNS(
          namespace,
          name,
          typeof val === 'string' ? val : getString(val),
        );
      }

      break;

    // *** EVENT TYPE ***
    case 'e':
      // * all options
      if (length === 2) {
        if (typeof value !== 'function') {
          if (value?.constructor === Object) {
            const {handle} = value as any;

            if (
              typeof handle === 'function' ||
              typeof handle?.handleEvent === 'function'
            ) {
              element.addEventListener(
                name,
                handle,
                value as AddEventListenerOptions,
              );

              return;
            }
          }

          throw new TypeError(`not function in event "${key}"`);
        }

        element.addEventListener(name, value);
      }

      // * capture option
      else if (length === 3 && split[2] === 'capture') {
        if (typeof value !== 'function')
          throw new TypeError(`not function in event "${key}"`);

        element.addEventListener(name, value, true);
      }

      // * boolean options
      else {
        if (typeof value !== 'function')
          throw new TypeError(`not function in event "${key}"`);

        const options: Exclude<AddEventListenerOptions, 'signal'> = {
          capture: undefined,
          once: undefined,
          passive: undefined,
        };

        for (let i = 2; i < length; i++) {
          const o = split[i];

          if (!(o in options))
            throw new TypeError(
              `out of capture|once|passive option in event key ${
                i + 1
              } "${key}"`,
            );

          if ((options as any)[o])
            throw new TypeError(
              `same option declared twice in event key ${i + 1} "${key}"`,
            );

          (options as any)[o] = true;
        }

        element.addEventListener(name, value, options);
      }

      break;

    // *** WRONG TYPE ***
    default:
      throw new TypeError(`out of a|an|p|e type in key 2 "${key}"`);
  }
};

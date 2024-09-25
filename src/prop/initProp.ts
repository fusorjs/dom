import {
  ELOptions,
  Fusion,
  ElementWithExtras,
  ELFunction,
  UpdatableProp,
} from '../types';
import {DEVELOPMENT, elementExtrasName, getPropertyDescriptor} from '../share';
import {update} from '../public';

import {convertAttribute, emptyAttribute} from './convertAttribute';

export const defaultParameterSeparator = '_';

let parameterSeparator = defaultParameterSeparator;

/**
 * Set global parameter separator string
 * Also change type `ParameterSeparator` declaration
 * @default "_"
 * @example "click_e_once"
 */
export const setParameterSeparator = (s: string) => (parameterSeparator = s);
export const getParameterSeparator = () => parameterSeparator;

const isProperty = (value: any, name: string) => {
  const d = getPropertyDescriptor(value, name);

  if (d && (d.writable || typeof d.set === 'function')) {
    return true;
  }
};

export const initProp = (
  element: ElementWithExtras,
  key: string,
  value: any,
): UpdatableProp | undefined => {
  if (DEVELOPMENT) {
    if (key === '__self') return; // React debug info: https://github.com/facebook/react/pull/4596
    if (key === '__source') return; // React debug info: https://github.com/facebook/react/pull/4596
    // if (key === 'umount') throw TypeError(`"umount" property reserved for future use`);
  }

  if (key === 'xmlns') return;
  if (key === 'is') return;
  if (key === 'mount') return;

  const split = key.split(parameterSeparator);
  const {length} = split;
  const [name, type] = split;

  if (!name) throw new TypeError(`empty name in key 1 "${key}"`);

  switch (
    type ??
    // *** AUTOMATIC TYPE ***
    ((typeof value === 'object' && value !== null) || isProperty(element, name)
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

        element[name as 'id'] = val;

        const updatable: UpdatableProp = {
          update: value,
          value: val,
          isAttr: false,
        };

        return updatable;
      }

      // static
      element[name as 'id'] = value;

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
      // todo refactor up - element instanceof HTMLElement ? undefined : null
      // https://stackoverflow.com/questions/3919291/when-to-use-setattribute-vs-attribute-in-javascript
      // https://stackoverflow.com/questions/52571125/setattributens-xmlns-of-svg-for-a-general-purpose-library
      // https://stackoverflow.com/questions/37746181/why-setattribute-getattribute-is-inconsistent-with-arguments-when-setting-xlink
      // ! can be null - https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
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
        const val = convertAttribute(value());

        if (val !== emptyAttribute) {
          // todo use createAttribute
          // ! namespace can be null - https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
          if (namespace === undefined) element.setAttribute(name, val);
          else element.setAttributeNS(namespace, name, val);
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

      const val = convertAttribute(value);

      if (val === emptyAttribute) return; // ! do nothing only for static attributes

      // todo use createAttribute
      // ! namespace can be null - https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
      if (namespace === undefined) element.setAttribute(name, val);
      else element.setAttributeNS(namespace, name, val);

      break;

    // *** EVENT TYPE ***
    case 'e':
      let options: boolean | AddEventListenerOptions | ELOptions | undefined;
      let updateAfter: boolean | undefined;
      let callback: ELFunction | undefined;

      // prepare callback & options

      if (DEVELOPMENT && !value)
        throw new TypeError(`invalid value for event property "${key}" `);

      if (typeof value === 'function') {
        callback = value;
      } else {
        const {handle} = value;

        if (handle) {
          if (typeof handle === 'function') {
            callback = handle;
            const {capture, once, passive, signal, update} = value;
            options = {capture, once, passive, signal};
            updateAfter = update;
          } else {
            const {handleEvent} = handle;

            if (typeof handleEvent === 'function') {
              callback = handleEvent.bind(handle);
              const {capture, once, passive, signal, update} = value;
              options = {capture, once, passive, signal};
              updateAfter = update;
            }
          }
        } else {
          const {handleEvent} = value;

          if (typeof handleEvent === 'function') {
            callback = handleEvent.bind(value);
          }
        }
      }

      if (DEVELOPMENT && !callback)
        throw new TypeError(`invalid callback for event property "${key}"`);

      // prepare options

      if (length > 2) {
        let capture: boolean | undefined;
        let once: boolean | undefined;
        let passive: boolean | undefined;

        for (let i = 2; i < length; i++) {
          const option = split[i];

          // prettier-ignore
          switch (option) {
            case 'capture': capture     = true; break;
            case 'once'   : once        = true; break;
            case 'passive': passive     = true; break;
            case 'update' : updateAfter = true; break;
            default: throw new TypeError(
              `invalid event property key "${key}" option "${option}"`,
            );
          }
        }

        if (options) {
          // override options object with key options
          options = {
            ...(options as ELOptions),
            ...{
              capture,
              once,
              passive,
            },
          };
        } else {
          options =
            capture && !once && !passive ? true : {capture, once, passive};
        }
      }

      // add listener

      const listener: EventListener = updateAfter
        ? (event) => {
            const self: Fusion =
              element[elementExtrasName]?.component ?? element;

            callback!(event as Event & {target: Element}, self);

            update(self);
          }
        : (event) => {
            callback!(
              event as Event & {target: Element},
              element[elementExtrasName]?.component ?? element,
            );
          };

      element.addEventListener(name, listener, options);

      break;

    // *** WRONG TYPE ***
    default:
      throw new TypeError(`invalid property key type "${type}" in "${key}"`);
  }
};

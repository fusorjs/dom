import {ElementWithExtras, Prop, UpdatableProp} from '../types';
import {elementExtrasName, getPropertyDescriptor, getString} from '../share';

import {convertAttr, emptyAttr} from './share';

export const defaultPropSplitter = '_';

let propSplitter = defaultPropSplitter;

export const setPropSplitter = (s: string) => (propSplitter = s);

const isProperty = (value: any, name: string) => {
  const d = getPropertyDescriptor(value, name);

  if (d && (d.writable || typeof d.set === 'function')) {
    return true;
  }
};

export const initProp = (
  element: ElementWithExtras,
  key: string,
  value: Prop,
) => {
  // todo development only
  if (key === '__self') return; // React debug info: https://github.com/facebook/react/pull/4596
  if (key === '__source') return; // React debug info: https://github.com/facebook/react/pull/4596

  if (key === 'is') return;
  if (key === 'mount') return;
  if (key === 'umount') throw TypeError(`"umount" property not supported`);

  const split = key.split(propSplitter);
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
            const handle = (value as any)
              .handle as EventListenerOrEventListenerObject;

            if (
              typeof handle === 'function' ||
              typeof handle?.handleEvent === 'function'
            ) {
              // if ((value as any).update) {
              //   const handler = handle;
              //   handle = (...args: any[]) => {
              //     (handler?.handleEvent || handler)(...args);
              //     component.update();
              //   };
              //   component.__hasUpdatableEvents = true;
              // }

              element.addEventListener(
                name,
                (value as any).update
                  ? 'handleEvent' in handle
                    ? (event: Event) => {
                        handle.handleEvent(event);
                        element[elementExtrasName]?.component?.update();
                      }
                    : (event: Event) => {
                        handle(event);
                        element[elementExtrasName]?.component?.update();
                      }
                  : handle,
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

        const options: Exclude<AddEventListenerOptions, 'signal'> & {
          update?: true;
        } = {
          capture: undefined,
          once: undefined,
          passive: undefined,
          update: undefined,
        };

        for (let i = 2; i < length; i++) {
          const o = split[i];

          if (!(o in options))
            throw new TypeError(
              `out of capture|once|passive|update option in event key ${
                i + 1
              } "${key}"`,
            );

          if ((options as any)[o])
            throw new TypeError(
              `same option declared twice in event key ${i + 1} "${key}"`,
            );

          (options as any)[o] = true;
        }

        element.addEventListener(
          name,
          options.update
            ? (event: Event) => {
                value(event);
                element[elementExtrasName]?.component?.update();
              }
            : value,
          options,
        );
      }

      break;

    // *** WRONG TYPE ***
    default:
      throw new TypeError(`out of a|an|p|ps|e type in key 2 "${key}"`);
  }
};

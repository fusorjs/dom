import {getString} from './utils';
import {Evaluable, Prop, PropData, StaticProp} from './types';
import {evaluate, stringify} from './utils';

export const prepareProp = (value: any) => {
  switch (value) {
    case '': // ? maybe not
    case null:
    case false:
    case undefined:
      return undefined;
    case true:
      return '';
    default:
      return getString(value);
  }
};

export const updateProp = (element: Element, key: string, data: PropData) => {
  const value = prepareProp(evaluate(data.updater));

  if (value === data.value) return;

  data.value = value;

  if (value === undefined) element.removeAttribute(key);
  else element.setAttribute(key, value);
};

export const useCapture = false;

export const initProp = (element: Element, key: string, value: Prop) => {
  // static event listener
  if (key.startsWith('on')) {
    if (typeof value !== 'function')
      throw new TypeError(
        `illegal property: "${key}" = ${stringify(value)}; expected function`,
      );

    element.addEventListener(
      key.substring(2),
      value as EventListener,
      useCapture,
    );
  }
  // todo data-
  // todo style...
  // todo area-
  // todo classList - init

  // ! ref deprecated
  // ! as you should get the reference by simply calling the function
  // ! this leads to better component separation
  // else if (key === 'ref') {
  //   switch (typeof val) {
  //     case 'function': val(element); break;
  //     case 'object': (val as any).current = element; break;
  //     default: throw new TypeError(
  //       `illegal property: "${key}" = ${stringify(val)}; expected function or object`
  //     );
  //   }
  // }

  // todo tests
  // else if (key === 'init') {
  //   if (typeof val === 'function') {
  //     val(element);
  //   }
  //   else {
  //     throw new TypeError(
  //       `illegal property: "${key}" = ${stringify(val)}; expected function`
  //     );
  //   }
  // }

  // dynamic property
  else if (typeof value === 'function') {
    const prop = prepareProp(evaluate(value as Evaluable<StaticProp>));

    if (prop !== undefined) element.setAttribute(key, prop);

    const data: PropData = {
      updater: value as Evaluable<StaticProp>,
      value: prop,
    };

    return data;
  }
  // static property
  else {
    const prop = prepareProp(value);

    if (prop !== undefined) element.setAttribute(key, prop);
  }
};

// https://stackoverflow.com/questions/3919291/when-to-use-setattribute-vs-attribute-in-javascript
// https://quirksmode.org/dom/core/#attributes

// https://www.drupal.org/node/1420706#comment-6423420
// tabindex: "tabIndex",
// readonly: "readOnly",
// "for": "htmlFor",
// "class": "className",
// maxlength: "maxLength",
// cellspacing: "cellSpacing",
// cellpadding: "cellPadding",
// rowspan: "rowSpan",
// colspan: "colSpan",
// usemap: "useMap",
// frameborder: "frameBorder",
// contenteditable: "contentEditable"

// Attributes vs Properties
// https://stackoverflow.com/questions/22151560/what-is-happening-behind-setattribute-vs-attribute
// input.value - does not change Attribute
// asetAttribute('href', '/abc') - a.href === 'http://domain/abc
// a.href = '/abc' - a.getAttribute('href') === '/abc'

/*
element  | attribute | property
---------+-----------+----------------
option   | selected  | defaultSelected (bool)
label    | for       | htmlFor
input    | checked   | defaultChecked (bool)
input    | value     | defaultValue (string)
select   | multiple  | multiple (bool)
li       | value     | value (int)
*/

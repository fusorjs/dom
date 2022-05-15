import {getString} from './utils';
import {Evaluable, Prop, UpdatableProp, StaticProp} from './types';
import {evaluate, stringify} from './utils';

export const emptyProp = undefined;

export const convertProp = <T>(value: T): T | typeof emptyProp | '' => {
  switch (value) {
    case '' as any: // ? maybe not
    case null:
    case false as any:
    case emptyProp:
      return emptyProp;
    case true as any:
      return '';
    default:
      return value;
  }
};

export const useCapture = false;

export const initProp = (element: Element, key: string, value: Prop) => {
  value = convertProp(value); // todo except (typeof value === 'function')

  // do nothing
  if (value === emptyProp) {
    return;
  }
  // init static event listener
  else if (key.startsWith('on')) {
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

  // init dynamic property
  else if (typeof value === 'function') {
    const val = convertProp(evaluate(value as Evaluable<StaticProp>));

    if (val !== emptyProp) element.setAttribute(key, getString(val));

    const data: UpdatableProp = {
      update: value as Evaluable<StaticProp>,
      value: val,
    };

    return data;
  }
  // init static property
  else {
    element.setAttribute(key, getString(value));
  }
};

export const updateProp = (
  element: Element,
  key: string,
  data: UpdatableProp,
) => {
  const value = convertProp(evaluate(data.update));

  if (value === data.value) return;

  data.value = value;

  if (value === emptyProp) element.removeAttribute(key);
  else element.setAttribute(key, getString(value));
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

// https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes

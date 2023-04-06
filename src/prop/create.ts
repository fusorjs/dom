import {Prop, UpdatableProp, PropType} from '../types';
import {getString, stringify} from '../utils';

import {convertAttr, emptyAttr} from './share';

/**
 * Fusor v2
 * automatic - attr or prop,
 *           - if `preferProp`:`property`|`attribute` is set in Config it will be default
 *           - Otherwise:
 *             - user property if it is defined on the element prototype.
 *             - set as attributes
 * property$p
 * attribute$a
 * event$e
 * event$e$capture$once$passive
 */

export const createProp = (
  element: Element,
  key: string,
  value: Prop,
  type: PropType,
) => {
  // init static event listener
  if (type === PropType.BUBBLING_EVENT || type === PropType.CAPTURING_EVENT) {
    if (typeof value !== 'function')
      throw new TypeError(
        `illegal event: "${key}" value: ${stringify(value)} expected: function`,
      );

    element.addEventListener(key, value, type === PropType.CAPTURING_EVENT);
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

  // init dynamic attribute/property
  else if (typeof value === 'function') {
    let val = value();

    const isAttr = type === PropType.ATTRIBUTE;

    if (isAttr) {
      val = convertAttr(val);

      if (val !== emptyAttr) element.setAttribute(key, getString(val));
    } else {
      element[key as 'id'] = val as any;
    }

    const updatable: UpdatableProp = {
      update: value,
      value: val,
      isAttr,
    };

    return updatable;
  }

  // init static attribute/property
  else {
    if (type === PropType.ATTRIBUTE) {
      const v = convertAttr(value);

      if (v === emptyAttr) return; // do nothing

      // todo NS https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course#scripting_in_namespaced_xml
      element.setAttribute(key, getString(v));
    } else {
      element[key as 'id'] = value as any;
    }
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

// https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
// https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes

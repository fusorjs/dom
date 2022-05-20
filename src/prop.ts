import {getString, ObjectIs} from './utils';
import {Evaluable, Prop, UpdatableProp, StaticProp, PropType} from './types';
import {evaluate, stringify} from './utils';

export const emptyAttr = undefined;

export const convertAttr = <T>(value: T): T | typeof emptyAttr | '' => {
  switch (value) {
    case '' as any: // ? maybe not
    case null:
    case false as any:
    case emptyAttr:
      return emptyAttr;
    case true as any:
      return '';
    default:
      return value;
  }
};

export const initProp = (
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

    element.addEventListener(
      key,
      value as EventListener,
      type === PropType.CAPTURING_EVENT,
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

  // init dynamic attribute/property
  else if (typeof value === 'function') {
    let val = evaluate(value as Evaluable<StaticProp>);

    const isAttr = type === PropType.ATTRIBUTE;

    if (isAttr) {
      val = convertAttr(val);

      if (val !== emptyAttr) element.setAttribute(key, getString(val));
    } else {
      element[key as 'id'] = val as any;
    }

    const updatable: UpdatableProp = {
      update: value as Evaluable<StaticProp>,
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

      element.setAttribute(key, getString(v));
    } else {
      element[key as 'id'] = value as any;
    }
  }
};

export const updateProp = (
  element: Element,
  key: string,
  updatable: UpdatableProp,
) => {
  const {update, value: prevValue, isAttr} = updatable;
  const nextValue = isAttr ? convertAttr(evaluate(update)) : evaluate(update);

  if (ObjectIs(nextValue, prevValue)) return;

  updatable.value = nextValue;

  if (isAttr) {
    if (nextValue === emptyAttr) element.removeAttribute(key);
    else element.setAttribute(key, getString(nextValue));
  } else {
    element[key as 'id'] = nextValue as any;
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

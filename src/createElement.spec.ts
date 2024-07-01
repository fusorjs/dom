import {createElement} from './createElement';
import {NamespaceUri, TagName} from './types';

test.each<[string, TypeErrorConstructor, undefined | NamespaceUri, any]>([
  [
    `cannot use both properties "mount" and "is" together`,
    TypeError,
    undefined,
    {mount: () => {}, is: 'custom-elm'},
  ],
  [
    `"mount" property is not supported with namespaces yet`,
    TypeError,
    'blah' as NamespaceUri,
    {mount: () => {}},
  ],
  [`"mount" property is not a function`, TypeError, undefined, {mount: 123}],
  [`not string property "is"`, TypeError, undefined, {is: 123}],
])(
  'createElement throws "%p" %p',
  (expectedMessage, expectedType, providedNamespace, providedProps) => {
    expect(() => {
      createElement(providedNamespace, 'div' as TagName, providedProps);
    }).toThrow(expectedType);

    expect(() => {
      createElement(providedNamespace, 'div' as TagName, providedProps);
    }).toThrow(expectedMessage);
  },
);

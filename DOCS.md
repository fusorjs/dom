# Documentation

## Attributes vs Properties vs Events

There are four distinct types of named parameters:

- **attribute**: normal names, ex: `id`, `href`, `class`.
- **property**: names end with `$$`, case-sensitive, ex: `value$$`, `checked$$`, `class$$ = className$$`.
- **bubbling event**: names start with `on`, ex: `onclick`.
- **capturing event**: names start with `on` and end with `$$`, ex: `onclick$$`.

> To overwrite the above rules, see: `getPropConfig`.

Values:

- `undefined` attribute value will remove the attribute, otherwise the attribute will be set with stringified value, see: `getString`.
- Property value will be applied as it is.

## Children

A child can be of any value:

- Boolean values are not shown, so you could do logical expressions: `isVisible && modalDialog`.
- Static array values are treated as the usual children (nested arrays not supported yet).
- Dynamic array values will replace associated children (currently **all children will be replaced**, just use a single dynamic children array for now).

## Updating

When `Component` updates, it calls every associated dynamic:

- prop function
- child function
- child `Component.update` method

And then it will update the DOM only if:

- the value has changed
- the dynamic children array reference has changed

> You should try to update only necessary components for performance.

## More

- Use functions to declare dynamic props/children.
- A Fusor's HTML/SVG `Component.element` never changes.
- Your dynamic child function can return different DOM Element or any other value.
- Dynamic children arrays can have dynamic elements (see: `RECURSION_LIMIT` in config).
- Do not create Component in dynamic child (ex: `p(() => div(() => ++count)))`). It will be first recreated and then updated every time its parent will be updated. Cheche it before (ex: `const cache = div(() => ++count))`) instead. Also the same applies to dynamic child arrays: `p(() => [div(() => ++count))])`.

## Functional Notation vs JSX

- Just Javascript, no new syntax, natural comments.
- No need for a build/compile step/tool.
- Use many props objects and children arrays in any order.

```js
div(childrenArray1, propsObject1, childrenArray2, propsObject2);
```

> You do not need to spread `...` objects or arrays.

## Naming Conventions

- element component names are all lowercased, uppercase your components so you could instantiate them like this: `const unitSelector = UnitSelector()`
- element event handlers are lovercase (e.g.: `onchange(Event)`). To distingush from your event handlers use camelCase (e.g.: `onChange(value)`)

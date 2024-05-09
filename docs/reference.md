# Reference

## Values

### Child

- A `function` is executed and its return value is subjet to the following rules, dynamic value is configured to be able to `update` itself in the future and the `Component` is created
- A `Component` instance renders its `element`
- `true, false, null, undefined` are converted to empty text nodes to enable logical expressions, ex: `isVisible && <ModalDialog />`
- Static `Array` values are applied to the element according rules above, including nested arrays
- Everything else is converted into a text node
- Dynamic `Array` (returned from a function) updates associated children before the terminator node which is added at the end. Dynamic arrays differ from the static in that they are not creating new components from their functional elements

> Nested arrays for added performance benefit of not needing to flatten them and to not recreate multiple arrays objects copies
> Functions in dynamic arrays are for added benefit of performance and flexibility to create dynamic arrays once and not recreate them when data change is needed

### Property

- Property values are applied as-is

### Attribute

- `"", null, false, undefined` - attribute is removed
- `true` - attribute is set to `""`
- Everything else is converted to string and applied to element as its attributes.

### When DOM is updated?

The current DOM value will be updated only if:

- [primitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values) value has changed
- object value reference has changed

> Therefore, you should cache referenced values

## Keys

### Set property or attribute automatically

Do not use `_` suffix:

- Set a property if value is of reference type: `Object`, `Array`, `Function`... (not `null`)
- Set a property if it already exists on the element
- Set an attribute otherwise

### Enforce the type

Use `_` suffix:

- `a` - `a`ttribute
- `an` - `a`ttribute `n`amespaced
- `p` - `p`roperty
- `ps` - `p`roperty `s`tatic
- `e` - `e`vent

### Special props

- `is` - custom element name
- `mount` - element connect callback

> In functional notation they must be present in the first props object

### Change splitter

Use `setPropSplitter('$')` to change the global suffix splitter from `_`

### Example

```jsx
<div
  // auto-detect whether to set property or attribute
  id="abc"
  class="visible"
  style="color:red"
  selected={123}
  // property
  checked_p={456}
  // property static
  onclick_ps={() => 'Clicked!'}
  customFunction_ps={() => 'Custom component function property'}
  // attribute
  myprop_a="visible"
  // attribute with namespace
  {...{'xlink:href_an_http://www.w3.org/1999/xlink': 'abc'}}
  // bubbling event listener
  click_e={() => 'Clicked!'}
  // all boolean event options
  click_e_capture_once_passive_update={() => 'Clicked!'}
  // all event options
  click_e={{
    handle: () => 'Clicked!', // or handle: {handleEvent: () => 'Clicked!'},
    capture: true,
    once: true,
    passive: true,
    signal: abort,
    update: true, // update target component after event handler completes
  }}
  // special props
  is="custom-element-name"
  mount={(self) => {
    self.update();
    return () => 'unmount';
  }}
/>
```

## JSX

### Configure

If you going to use JSX, you will need a build tool. For example, TypeScript compiler will suffice.

> `tsconfig.json` or `jsconfig.json`

Modern way:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@fusorjs/dom"
  }
}
```

Old way: (must `import {jsx} from '@fusorjs/dom'` in every `[j|t]sx` file)

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "jsx"
  }
}
```

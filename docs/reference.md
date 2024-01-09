# Reference

## Values

### Child

- `function` is executed and its return value is subjet to the following rules, dynamic value is configured to be able to `update` it in the future and `Component` is created.
- `Component` instance provides its `element`
- `true, false, null, undefined` are converted to empty text node to enable logical expressions: `isVisible && <ModalDialog />`
- Static `Array` values are applied to the element according rules above, including nested arrays
- Everything else is converted into a text node
- Dynamic `Array` (returned from function) updates associated children (terminator node added at the end), it differs from static arrays in that it does not add dynamic values to component

> Nested arrays for added performance benefit of not needing to flatten them and to not recreate multiple arrays objects copies
> Functions in dynamic arrays are for added benefit of performance and flexibility to create dynamic arrays once and not recreate them when data change is needed

### Property

- Property values are applied as-is

### Attribute

- `"", null, false, undefined` - attribute is removed
- `true` - attribute is set to `""`
- Everything else is converted to string and set with attribute.

### When DOM is updated?

The current DOM value will be updated only if:

- [primitive](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values) value has changed
- object value reference has changed

> Therefore, you should cache referenced values

## Keys

### Set property or attribute automatically

Do not use `$` suffix:

- Set a property if value is of reference type: `Object`, `Array`, `Function`... (not `null`)
- Set a property if it is already exists on the element
- Set an attribute otherwise

### Enforce the type

Use `$` suffix:

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

Use `setPropSplitter('_')` to change the global suffix splitter from `$`

### Example

```jsx
<div
  // auto-detect whether to set property or attribute
  id="abc"
  class="visible"
  style="color:red"
  selected={123}
  // property
  checked$p={456}
  // property static
  onclick$ps={() => 'Clicked!'}
  customFunction$ps={() => 'Custom component function property'}
  // attribute
  myprop$a="visible"
  // attribute with namespace
  {...{'xlink:href$an$http://www.w3.org/1999/xlink': 'abc'}}
  // bubbling event listener
  click$e={() => 'Clicked!'}
  // all boolean event options
  click$e$capture$once$passive$update={() => 'Clicked!'}
  // all event options
  click$e={{
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

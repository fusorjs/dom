# Reference

## Values

### Child

- `true, false, null, undefined` are converted to empty text node to enable logical expressions: `isVisible && <ModalDialog />`
- Static arrays are flattened
- Dynamic arrays will affect associated children (**TODO**, currently all children)
- Everything else is converted into a text node

### Property

- Property values are applied as-is

### Attribute

- `"", null, false, undefined` - attribute is removed
- `true` - attribute is set to `""`
- Everything else is converted into string and set with attribute.

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

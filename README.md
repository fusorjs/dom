# @fusorjs/dom

## DOM library for making user interfaces.

## Rules

- the Component's Element never changes
- use functions for dynamic props/children (the Element can change in dynamic child)
- props objects can be applied multiple times (spread/rest optimization, see button in html.ts), please place them before children for readability
- children arrays could be appended/updated multiple times (spread/rest optimization)
- dynamic children arrays can have dynamic elements (see: `RECURSION_LIMIT` config)
- same (by ref) dynamic arrays will not trigger updates
- Do not mutate props objects or children arrays that you pass to components.
- Do not spread join props objects or children array, just pass them separately to components.
- Do not create Component in dynamic child (ex: `p(() => div(() => ++count)))`). It will be first recreated and then updated every time its parent will be updated. Cheche it before (ex: `const cache = div(() => ++count))`) instead. Also the same applies to dynamic child arrays: `p(() => [div(() => ++count))])`.
- boolean children are not shown, so you could do: `isVisible && ModalDialog`

## Main Questions

1. At the moment we do not have `context`, as in React. Maybe we should use props for context so the context will be explicit, not hidden. Or should we introduce it like in React? Implementing it is not hard, but should we?

2. There is no `element` unmounting event at the moment. I've managed to overcome this by using `WeakRef` in certain scenarious. Also the `Observers/Proxies` potentially could be useful. Anyway this needs more investigation, as "destructuring" the whole tree of components could decrease performance. Although it is not hard to implement.

## The Default Config (Prelude)

### Attributes/Properties/Events

> to overwrite the following config see: `getPropConfig`

- attribute names written as usual (ex: `id`, `href`, `class`)
- property names end with `$$` (ex: `value$$`, `checked$$`), shortcut `class$$` same as `className$$` (property names are case-sensitive)
- bubbling event names start with `on` (ex: `onclick`)
- capturing event names start with `on` and end with `$$` (ex: `onclick$$`)

## Naming Conventions

- element component names are all lowercased, uppercase your components so you could instantiate them like this: `const unitSelector = UnitSelector()`
- element event handlers are lovercase (e.g.: `onchange(Event)`). To distingush from your event handlers use camelCase (e.g.: `onChange(value)`)

## Done

- reactive state
- optimize html component: compile props & children to static and dynamic (closure), assign static and save dynamic on initial render, the following re-renders will update only dynamic values
- only update parts of the DOM, that actually have changed, and keep the rest unchanged
- diff array children, momoized, optimized
- split out `common` to a separate library
- make 100% typescript
- Declarative logical control structures? No, we do not need them. The javascript control flow operators/expressions are enough.
- refactor init children
- Maybe we should separete render to creation and updation phases? No we should not! Because we need to be able to return different elements or even text/number/etc on update.
- Set property instead of setAttribute for maximum performace. (Use attributes in development maybe for visibility? - No, just props are enough.) After a while: the performance difference is neglible. But the important thing is: not all attributes are mapped to props (area), non standard attributes aren't mapped (custom elements), svg attributes aren't mapped. Reverting back for the time being.
- 100% test coveragge
- rename to: dom-element
- declare props in any argument, multiple times (not only in the first, spread/rest optimization)
- init dynamic props and children immidiately (now you have to call updater to set the dynamic values). For example in children initializer we create placeholder text node. And only after `update` we will swap it with real value. We should avoid it.
- Create default behaviour for array child. It will make easier to use api for newcomers. It should be best optimized for most common cases. After some thoughts, the default behaviour should be to construct new element out of array on each update. Whe should not manipulate/mutate element's children!
- remove external dependencies (common)
- init children from array, multiple times (spread/rest optimization)
- implement attribute setters for svg
- migrate to component class and prop/child instance data instead of closures (memory optimization)
- init children from static array (spread/rest optimization)
- replace all children from dynamic array (spread/rest optimization)
- same (by ref) dynamic arrays will not trigger updates
- add possibility to set property (ex: input.value) instead of always setting attribute (probably by using prefix "$" or by defining all cases)
- dynamic children arrays can have dynamic elements
- children with value of true/false are not shown, ex: isVisible && Modal()

## Todo

- implement style, object, data attributes,
- replace only range for dynamic children array (using node start/end indexes), (are they fragments?)
- elements with event handler callbacks (onclick) should be static in typescript https://stackoverflow.com/q/71111120/7138254
- optimize by diffing nodes for dynamic children array
- jsx support (but `hyper` approach more flexible: natural code/comments, multiple props/children without spread/rest recreation)
- shx to rimraf?

```json
  "exports": {
    ".": {
      "default": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./svg": {
      "default": "./dist/svg.js",
      "types": "./dist/svg.d.ts"
    },
    "./html": {
      "default": "./dist/html.js",
      "types": "./dist/html.d.ts"
    },
    "./package.json": "./package.json"
  },
```

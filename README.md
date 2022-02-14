# @perform/dom-element

The generic @perform dom html, svg element components.

## Rules

- the Element never changes
- use functions for dynamic props/children
- you should use props for context (context should be explicit, not hidden)
- if component is dynamic, you should call it (update) to fully initialize its dynamic props/children
- props objects can be applied multiple times (for performance, see button in html.ts), please place them before children for readability

## Naming Conventions

- element component names are all lowercased, uppercase your components so you could instantiate them like this: `const unitSelector = UnitSelector()`
- element event handlers are lovercase (e.g.: `onchange(Event)`). To distingush from your event handlers use camelCase (e.g.: `onChange(value)`)

## CHANGELOG

- reactive state
- optimize html component: compile props & children to static and dynamic (closure), assign static and save dynamic on initial render, the following re-renders will update only dynamic values
- only update parts of the DOM, that actually have changed, and keep the rest unchanged
- diff array children, momoized, optimized
- split out `common` to a separate library
- make 100% typescript
- Declarative logical control structures? No, we do not need them. The javascript control flow operators/expressions are enough.
- refactor init children
- Maybe we should separete render to creation and updation phases? No we should not! Because we need to be able to return different elements or even text/number/etc on update.
- set/get properties instead of (set/get)Attribute for maximum performace (use attributes in development maybe for visibility? - no, just props are enough)
- 100% test coveragge
- rename to: dom-element
- declare props in any argument, multiple times (not only in the first) optimization
- init dynamic props and children immidiately (now you have to call updater to set the dynamic values). For example in children initializer we create placeholder text node. And only after `update` we will swap it with real value. We should avoid it.
- Create default behaviour for array child. It will make easier to use api for newcomers. It should be best optimized for most common cases. After some thoughts, the default behaviour should be to construct new element out of array on each update. Whe should not manipulate/mutate element's children!
- remove external dependencies (common)

## BACKLOG

- migrate to classes

- implement attribute setters for svg
- init multiple children from dynamic array (usinng node indexes range for updater).
- elements with event handler callbacks (onclick) should be static in typescript
- convinience method for working with elements (body <- App)
- implement style object, data-\* object attributes,

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

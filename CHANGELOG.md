# Changes

## Remaining Questions

- At the moment we do not have `context`, as in React. Maybe we should use props for context so the context will be explicit, not hidden. Or should we introduce it like in React? Implementing it is not hard, but should we?

- There is no `element` unmounting event at the moment. I've managed to overcome this by using `WeakRef` in certain scenarious. Also the `Observers/Proxies` potentially could be useful. Anyway this needs more investigation, as "destructuring" the whole tree of components could decrease performance. Although it is not hard to implement.

## Todo

- shx to rimraf?
- jsx support
- optimize by diffing nodes for dynamic children array
- Maybe make Prop and Child classes?
- Optimize spread/rest in html.ts and svg.ts, check `javascript rest vs arguments performance` (https://www.measurethat.net/Benchmarks/Show/10518/0/rest-parameters-vs-arguments), speed and especially memory usage (spread/rest optimization, see `button` in [html.ts](src/html.ts)).
- elements with event handler callbacks (onclick) should be static in typescript https://stackoverflow.com/q/71111120/7138254
- replace only range for dynamic children array (using node start/end indexes), (are they fragments?)
- support nested children arrays, not just one level
- implement style, object, data attributes,

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

## Done

### Version 2

Version 2 vs 1 differences:

- When returning component from a dynamic function, its update method no longer will be called automatically (like in v1). Because sometimes we want to re-create a component on each update (in v1 it would create component and then call update immidiately, doing the same work twice).

### Version 1

- children with value of true/false are not shown, ex: isVisible && Modal()
- dynamic children arrays can have dynamic elements
- add possibility to set property (ex: input.value) instead of always setting attribute (probably by using prefix "$" or by defining all cases)
- same (by ref) dynamic arrays will not trigger updates
- replace all children from dynamic array (spread/rest optimization)
- init children from static array (spread/rest optimization)
- migrate to component class and prop/child instance data instead of closures (memory optimization)
- implement attribute setters for svg
- init children from array, multiple times (spread/rest optimization)
- remove external dependencies (common)
- Create default behaviour for array child. It will make easier to use api for newcomers. It should be best optimized for most common cases. After some thoughts, the default behaviour should be to construct new element out of array on each update. Whe should not manipulate/mutate element's children!
- init dynamic props and children immidiately (now you have to call updater to set the dynamic values). For example in children initializer we create placeholder text node. And only after `update` we will swap it with real value. We should avoid it.
- declare props in any argument, multiple times (not only in the first, spread/rest optimization)
- rename to: dom-element
- 100% test coveragge
- Set property instead of setAttribute for maximum performace. (Use attributes in development maybe for visibility? - No, just props are enough.) After a while: the performance difference is neglible. But the important thing is: not all attributes are mapped to props (area), non standard attributes aren't mapped (custom elements), svg attributes aren't mapped. Reverting back for the time being.
- Maybe we should separete render to creation and updation phases? No we should not! Because we need to be able to return different elements or even text/number/etc on update.
- refactor init children
- Declarative logical control structures? No, we do not need them. The javascript control flow operators/expressions are enough.
- make 100% typescript
- split out `common` to a separate library
- diff array children, momoized, optimized
- only update parts of the DOM, that actually have changed, and keep the rest unchanged
- optimize html component: compile props & children to static and dynamic (closure), assign static and save dynamic on initial render, the following re-renders will update only dynamic values
- reactive state

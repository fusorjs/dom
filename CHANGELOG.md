# Changes

## Todo

- shx to rimraf?
- optimize by diffing nodes for dynamic children array
- Optimize spread/rest in html.ts and svg.ts, check `javascript rest vs arguments performance` (https://www.measurethat.net/Benchmarks/Show/10518/0/rest-parameters-vs-arguments), speed and especially memory usage (spread/rest optimization, see `button` in [html.ts](src/html.ts)).
- elements with event handler callbacks (onclick) should be static in typescript https://stackoverflow.com/q/71111120/7138254
- Maybe:
  - Move create to Component static method?
  - Make Prop and Child classes with static create and update methods? - Yes to Prop for sure! So we could move prop updaters to array instead of object (speed of array construction).
- replace only range for dynamic children array (using node start/end indexes), (are they fragments?)
- support nested children arrays, not just one level (fix html button)
- implement style, object, data attributes
- createAttribute object and update it directly
- refactor tests

## Done

### Version 2.0.2

- JSX support added
- improved docs

### Version 2.0.1

- added `ps` - `p`roperty `s`tatic type
- added `defaultPropSplitter`, `setPropSplitter`
- improved docs

### Version 2

Version 2 vs 1 differences:

- Can now automatically set property or attribute.
- Namespaced attributes are now available.
- All event options are supported now.
- event handle can have `any` return value (in v1 it must have been `void`)
- props can now be any value (in v1 only primitives typechecked)
- speed and code-complexity improvements
- refactored HTML/SVG creators

Version 2 breaking changes:

- Removed config, changed prop keys rules, no more `$$`, all possible options are available now, see the docs. if you get `ReferenceError: Cannot access 'variable' before initialization` this means your event names `onclick` have to be renamed to new notation `click$e`.
- When returning component from a dynamic function, its update method no longer will be called automatically (like in v1). Because sometimes we want to re-create a component on each update (in v1 it would create component and then call update immidiately, doing the same work twice). The main reason for this change is: we do not know whether user creates the component or passes it from somewhere else like a cache.
- upon Child/Prop init/update, the updater function will be called once in v2. In v1 it would keep executing until non-function value would be returned or recursion limit would be reached. As it turns out, the v1 way of `evaluate` is not needed and you ecouraged to manage updator functios yourself for clarity.
- removed deprecated HTML creators: dir, font, frame, frameset, marquee, param.

Component life-cycle methods will not be implemented as they natively implemented in Custom Elements. So you should use them together with Fusor. Previously these alternatives were investigated:

- DOMNodeRemoved is working, but MutationEvent is deprecated.
- MutationObserver does not have a way to detect its target unmounting.
- WeakRef is not reliable as it could never trigger.

Context (as in React) will not be implemented. Unless solid proves will be presented that we absolutely need it and cannot live without it. You can use props or imported/exported/enclosed/global variables instead. So that the context will be explicit, not hidden. Also the context needed in user components, not in html/svg components in what Fuser is concerned. Therefore the contex should be implemented elsewhere if needed.

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

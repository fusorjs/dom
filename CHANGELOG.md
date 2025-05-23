# Changelog

> Tasks are flowing from [Maybe](#maybe) down to [Done](#done).

## Maybe

- Extract functional notation (functions) into separate library (size - minus 1-2Kb)
- Extract `mount/unmount` logic to a plugin (create a plugin system) into a separate library.
- Move create to Component static method?
- Make Prop and Child classes with static create and update methods? - Yes to Prop for sure! So we could move prop updaters to array instead of object (speed of array construction).
- implement style, object, data attributes
- createAttribute object and update it directly
- elements with event handler callbacks (onclick) should be static in typescript <https://stackoverflow.com/q/71111120/7138254>. Or in version 3 will be deprecated.
- Move "extras" out of DOM element objects (see the first rule). At the moment cannot remove it because it is used in `connectedCallback`.
- Maybe remove `arrayRef` checks to be able to mutate arrays in place and not recreate them for performance. But on the oter hand this allows to fast ref check skipping whole array if it not changed. Maybe allow option in the `update({skipSameRef})` or add a symbol prop to array `[FusorMutableArray]`.
- Streamline all tag "renames" for all notations.
- Export `React`, so no need to configure `jsxImportSource/jsxFactory` like in Solid
- Add JSX `<Fragment></Fragment>` or `<></>` support (They are just arrays, right?)
- Instantiate components from existing HTML (SSR), in separate module, or is SSR obsolete? The SE can perfectly index SPAs nowadays.
- Add `x` hyper method (along with `h, s, m`) with `xmlns` parameter.
- Optimize very large dynamic children arrays length > 1000, using `Set`.

## Todo

- Invoke method call (if value changes) on the element: `setCustomValidity_c: () => pass1 === pass2 ? '' : 'passwords do not match'` translates to: `input.setCustomValidity('invalid');`
- Implement tagged template string function for HTML...
- Override a splitter for a current prop key, mybe like `_$$_name$$e` from `_` to `$$` or (`_"___"xlink:href___an___http://www.w3.org/1999/xlink`)
- Optimize spread/rest in html.ts and svg.ts, check `javascript rest vs arguments performance` <https://www.measurethat.net/Benchmarks/Show/10518/0/rest-parameters-vs-arguments>, speed and especially memory usage (spread/rest optimization, see `button` in [html.ts](src/html.ts)).
- Implement iterator support the same way as for static/dynamic arrays.
- build
  - Optimize build with rollup to be in line with ~3KiB size claim
  - Create `production` build with `development` checks removed
  - Create different build targets: ESM, CommonJS, UMD, AMD...

### Version 2.X.X

- Avoid creating excessive layers of components when only deeply nested child is dynamic (compression)

```ts
// @internal library use only
interface Component {
  element: Element;
  props?: DynamicProps;
  children?: DynamicChild[]; // only contains components, zipped, now wrappers
}
type init = (data: any) => Element | Component;
type getElement = (value: Element | Component) => Element;
// throw error if updating not Component
type update = (value: Element | Component) => void; // recursive
type updateCurrent = (value: Element | Component) => void;
```

## In Progress

### Version 2.6.1

- Remove all deprecated APIs: maybe Life, Component...
- Review DOM manipulation performance https://www.reddit.com/r/javascript/comments/1jhenyx/patterns_for_memory_efficient_dom_manipulation/
- Create functional-notation functions dynamically to reduce the bundle size.

### XXX

- Optimize child cache if value === node.
- Optimization: if inserting item in array, and next item is the same, then use insertBefore.
- Use nested dynamic arrays, they will be applied to element
  - if (typeof nextValue === 'function') nextValue = nextValue(); // ? do we need it ?
  - // todo apply nested arrays DEVELOPMENT depth < 5
- Optimize by diffing nodes for dynamic children Map

- Removed deprecated `Component` export.
## Done

### Version 2.5.3

- Fix dynamic array updating
- Improved JSX types
- Improved docs
- Moved away from <codesandbox.io> for demos (it breaks, link changes, syntax highlighting keeps breaking, it is slow...) to <codepen.io>

### Version 2.5.2

- Renamed type: `Props:Params`

### Version 2.5.1

- Add MathML support.
- Add `xmlns` attribute support.
- Improved types and performance.

Breaking changes:

- If you use old `Component` API the typings might break in hyper/functional notation. Use universal public API instead.
- Renamed: `setPropSplitter:setParameterSeparator, getPropSplitter:getParameterSeparator, defaultPropSplitter:defaultParameterSeparator`

Abandoned Ideas:

- Add the non recursive update `updateNR` method. Not needed as this can be achieved by wrapping component in a function.
- Create "sugar" syntax to subscribe/usubscribe to observable values. Not needed bacause method `mount` already sufficient for this task.

### Version 2.4.2

- Relaxed event type for event handlers to avoid tedious type casting.
- Added type propagation for universal api methods.
- Added `getPropSplitter` api method.

### Version 2.4.1

- New universal public API methods: `update`, `isUpdatable`, `getElement` should be used (preparing for version 3)
- Ability to `update` manually in event handlers. Provide second `self` argument.
- Improved docs and types.

Breaking changes:

- Move `h` and `s` methods to the root, out of `html` and `svg` respectively.
- `Self` argument in `mount` must be handled by the public API methods.
- Invalid attributes and children values throwing errors in development mode instead of silently being converted to strings.

### Version 2.3.1

- Add modern `jsx-runtime` integration to avoid `import {jsx} from '@fusorjs/dom'` in every `jsx` file. Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@fusorjs/dom"
  }
}
```

- Develop a JavaScript + Webpack + Babel starting skeleton Apps.
- Improved docs.

Breaking changes:

- Make `_` default splitter instead of `$` to avoid JQuery confusion (quick fix `setPropSplitter('$')`)

### Version 2.2.2

- Replace only the relevant nodes for dynamic children arrays (previously all element's children were replaced)
- Use functions inside dynamic arrays to add more flexibility for the outputted values
- Performance improvements.
- Change license from ISC to better known MIT.
- Refactor child tests

### Version 2.2.1

- new `$e$update` option to update target component after the event handler completes
- new `mount` property to trigger the provided callback when element connects to the DOM. Callback also has self component reference if it is a dynamic component. Return function to execute when disconnect occurs.
- improved docs

Deprecation:

- `Life` and `<fusor-life>` in favour of `mount`.

Breaking changes:

- Removed default `button({type="button"})` from functional notation, in JSX it wasn't introduced.
- Deprecated `Options` class, use `is` prop instead.

### Version 2.1.1

- Added JSX support to `<Life>` component
- Added support for nested child arrays flattening

Breaking changes:

- Jsx return type fixed to `DomElement | Component<DomElement>` insted of just `Component<DomElement>`

Internal changes that should not affect you:

- Renamed functions and types create... -> init...

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

#### Context (as in React)

The context will not be implemented unless solid evidence will be provided that we absolutely need it and cannot live without it.
The context needed in user components, not in html/svg components in which Fuser is concerned about.
Therefore the contex should be implemented outside of Fusor if needed.
Therefore Fusor components are more pure and FP ready.

The posible context implementations:

- Pass "context" as properties explicitly to child components.
- Dispatch custom events and bubble them up to the parent components.
- Import/export module/global variables.
- CSS variables could be used for themes.
- Maybe use a context monad?

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

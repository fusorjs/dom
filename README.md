


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

## BACKLOG

- rename to: dom-element
- declare props in any argument, multiple times (not only in the first) optimization
- convinience method for working with elements (body <- App)
- implement style object, data-* object attributes,

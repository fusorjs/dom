

## PROGRESS

### CHANGELOG

- reactive state
- optimize html component: compile props & children to static and dynamic (closure), assign static and save dynamic on initial render, the following re-renders will update only dynamic values
- only update parts of the DOM, that actually have changed, and keep the rest unchanged
- diff array children, momoized, optimized
- split out `common` to a separate library

### DEVELOMENT

- set/get properties instead of (set/get)Attribute for maximum performace (use attributes in development maybe for visibility?)

### BACKLOG

- maybe we shoild separete render to creation and updation phases
- declarative logical control structures
- refactor init children
- implement style object, data-* object attributes,
- make 100% typescript
- 100% test coveragge

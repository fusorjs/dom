
interface Attributes {
  [key: string]: unknown;
}

interface Child {
}

type ComponentCreatorOptArgs = [attributesOrChild?: Attributes | Child, ...children: Child[]];

type ComponentCreatorArgs = [tagName: string, ...ComponentCreatorOptArgs];

interface ComponentCreator {
  (...args: ComponentCreatorArgs): unknown;
}

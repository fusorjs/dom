
interface Attributes {
  [key: string]: unknown;
}

interface Child {
}

interface ComponentRenderer<Result = unknown> {
  (): Result;
}

type ComponentCreatorOptArgs = [attributesOrChild?: Attributes | Child, ...children: Child[]];

type ComponentCreatorArgs = [tagName: string, ...ComponentCreatorOptArgs];

interface ComponentCreator<Result = unknown> {
  (...args: ComponentCreatorArgs): Result;
}

interface MapObject {
  [k: string]: any;
}

interface Attributes {
  [key: string]: unknown;
}

interface Child {
}

type ComponentArgs = [attributesOrChild?: Attributes | Child, ...children: Child[]];

interface Component <Result> {
  (tagName: string, ...args: ComponentArgs): Result;
}

export const emptyAttr = undefined;

export const convertAttr = (value: any) => {
  switch (value) {
    case '': // ? maybe not
    case null:
    case false:
      return emptyAttr;
    case true:
      return '';
  }

  return value;
};

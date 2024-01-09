export const emptyChild = '';

export const convertChild = (value: any) => {
  switch (value) {
    case null:
    case true:
    case false:
    case undefined:
      return emptyChild;
  }

  return value;
};

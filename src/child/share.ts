import {Component} from '../component';
import {ValueNode} from '../types';
import {getString} from '../share';

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

export const getChildNode = (value: any): ValueNode => {
  if (value instanceof Element) {
    return value;
  } else if (value instanceof Component) {
    return value.element;
  } else {
    return document.createTextNode(getString(value));
  }
};

export const convertChildNode = (value: any): ValueNode => {
  return getChildNode(convertChild(value));
};


export const swapNodes = (node1: Node, node2: Node) => {
  // save the location of node2
  var parent2 = node2.parentNode as Node & ParentNode;
  var next2 = node2.nextSibling;
  // special case for node1 is the next sibling of node2
  if (next2 === node1) {
    // just put node1 before node2
    parent2.insertBefore(node1, node2);
  }
  else {
    // insert node2 right before node1
    (node1.parentNode as Node & ParentNode).insertBefore(node2, node1);

    // now insert node1 where node2 was
    if (next2) {
      // if there was an element after node2, then insert node1 right before that
      parent2.insertBefore(node1, next2);
    } else {
      // otherwise, just append as last child
      parent2.appendChild(node1);
    }
  }
};

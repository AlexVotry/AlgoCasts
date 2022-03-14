// --- Directions
// 1) Implement the Node class to create
// a binary search tree.  The constructor
// should initialize values 'data', 'left',
// and 'right'.
// 2) Implement the 'insert' method for the
// Node class.  Insert should accept an argument
// 'data', then create an insert a new node
// at the appropriate location in the tree.
// 3) Implement the 'contains' method for the Node
// class.  Contains should accept a 'data' argument
// and return the Node in the tree with the same value.

class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  insert(data) {
    const node = new Node(data);
    if (data > this.data) {
      this.right ? this.right.insert(data) : this.right = node; 
    } else {
      this.left ? this.left.insert(data) : this.left = node;
    }
  }

  contains(data) {
    if (data === this.data) return this;

    if (data > this.data && this.right) {
      return this.right.contains(data);
    }
    if (data < this.data && this.left) {
      return this.left.contains(data);
    }
    return null;
  }

}

module.exports = Node;

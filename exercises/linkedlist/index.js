// --- Directions
// Implement classes Node and Linked Lists
// See 'directions' document

class Node {
  constructor(data, next = null) {
    this.data = data;
    this.next = next;
  };
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(data) {
    this.head = new Node(data, this.head);
    // or insertFirst(data, 0);
  };

  size() {
    let counter = 0;
    let node = this.head;
    while (node) {
      counter++;
      node = node.next;
    }

    return counter;
  }

  getFirst() {
    return this.head;
  }

  getLast() {
    // if (!this.head) {
    //   return null;
    // } 
    
    // let node = this.head;
    // while(node) {
    //   if (!node.next) {
    //     return node;
    //   }
    //   node = node.next;
    // }
    return this.getAt(this.size() -1)
  }

  clear() {
    this.head = null;
  }

  removeFirst() {
    if (this.head) this.head =this.head.next;
  }

  removeLast() {
    // let previous = this.head;
    // if (!previous) {
    //   return;
    // }
    // let node = this.head.next;
    // if (!node) {
    //   this.head = null;
    //   return;
    // }

    // while (node.next) {
    //   previous = node;
    //   node = node.next;
    // }
    // previous.next = null;
    this.removeAt(this.size()-1)
  }

  insertLast (data) {
    // const item = new Node(data);
    // const last = this.getLast();

    // if (last) {
    //   last.next = item;
    // } else {
    //   this.head = item;
    // }
    this.insertAt(data, this.size());
  }

  getAt (index) {
    let node = this.head;
    while (index > 0) {
      if (!node) return null;
      node = node.next;
      index--;
    }
    return node;
  }
  
  removeAt (index) {
    if (index === 0 && this.head) {
      this.head = this.head.next;
      return;
    }
    let previous = this.getAt(index-1);
    if (!previous || !previous.next) return;

    previous.next = previous.next.next;
  }

  insertAt(data, index) {
    if (index === 0) {
      this.head = new Node(data, this.head);
      return;
    }
    
    let previous = this.getAt(index -1) || this.getLast();

    const node = new Node(data, previous.next);
    previous.next = node;
    
  }

  forEach (fn) {
    let node = this.head;
    for (let i = 0; i < this.size(); i++) {
      fn(node, i);
      node = node.next;
    }
  }

  // generator function* () { yield };
  *[Symbol.iterator] () {
    let node = this.head;
    while (node) {
      yield node;
      node = node.next;
    }
  }
}


module.exports = { Node, LinkedList };

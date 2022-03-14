// --- Directions
// Implement a Queue datastructure using two stacks.
// *Do not* create an array inside of the 'Queue' class.
// Queue should implement the methods 'add', 'remove', and 'peek'.
// For a reminder on what each method does, look back
// at the Queue exercise.
// --- Examples
//     const q = new Queue();
//     q.add(1);
//     q.add(2);
//     q.peek();  // returns 1
//     q.remove(); // returns 1
//     q.remove(); // returns 2

const Stack = require('./stack');

class Queue {
  constructor() {
    this.one = new Stack();
    this.two = new Stack();
  }

  add(item) {
    return this.one.push(item);
  }

  remove() {
    while (this.one.peek()) {
      this.two.push(this.one.pop());
    };

    return this.two.pop();
  }

  peek() {
    while (this.one.peek()) {
      this.two.push(this.one.pop());
    };
    
    return this.two.peek();
  }

}

let q = new Queue();

q.add(1);
q.add(2);
q.add(3);

module.exports = Queue;

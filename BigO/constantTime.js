// O(1) constant Time:  does operation just once regardless of how many elements input.

function compressBoxes(array) {
  console.log(array[0]);
}

function logTwoBoxes(boxes) {
  console.log(boxes[0]);  // O(1)
  console.log(boxes[1]);  // O(1)
}

logTwoBoxes(boxes) // O(2);

// still constant time, we don't care how many operations we have we round down to one. 
// logTwoBoxes(boxes) is callled O(1)

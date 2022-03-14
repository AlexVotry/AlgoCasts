// --- Directions
// Write a function that accepts a positive number N.
// The function should console log a step shape
// with N levels using the # character.  Make sure the
// step has spaces on the right hand side!
// --- Examples
//   steps(2)
//       '# '
//       '##'
//   steps(3)
//       '#  '
//       '## '
//       '###'
//   steps(4)
//       '#   '
//       '##  '
//       '### '
//       '####'

function steps(input, rotationFactor) {
  
}
steps("All-convoYs-9-be:Alert1.", 4);
module.exports = steps;
  // for (let row = 0; row < n; row++) {
  //   let stair = '';
  //   for (let column = 0; column < n; column++) {
  //     if (column <= row) {
  //       stair += "#";
  //     } else {
  //       stair += " ";
  //     }
  //   }
  //   console.log(stair);
  // }

// function steps(n) {
//   for (let i = 1; i <= n; i++) {
//     const numOfSpaces = n - i;
//     const numOfHashes = i;
//     console.log(print(numOfHashes, "hash") + print(numOfSpaces, "spaces"));
//   };
//   function print(times, type) {
//     let printable = '';
//     const chr = type === "hash" ? "#" : " ";
//     for (let i = 0; i < times; i++) {
//       printable += chr;
//     }
//     return printable;
//   }
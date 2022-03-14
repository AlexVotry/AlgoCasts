// --- Directions
// Write a program that console logs the numbers
// from 1 to n. But for multiples of three print
// “fizz” instead of the number and for the multiples
// of five print “buzz”. For numbers which are multiples
// of both three and five print “fizzbuzz”.
// --- Example
//   fizzBuzz(5);
//   1
//   2
//   fizz
//   4
//   buzz

function fizzBuzz(n) {
  let result = '';
  
  for( let i = 1; i <= n; i++) {
    let num = i;
    if((i % 3) === 0) num = "fizz"
    if((i % 5) === 0) num = "buzz";
    if((i %5) === 0 && (i % 3 === 0)) num = 'fizzbuzz';
    console.log(num);
  }
}

module.exports = fizzBuzz;

// let result = '';
// for( let i = 1; i <= n; i++) {
//   let num = i;
//   if((i % 3) === 0) num = "fizz"
//   if((i % 5) === 0) num = "buzz";
//   if((i %5) === 0 && (i % 3 === 0)) num = 'fizzbuzz';
//   result += num + '\n';
// }
// return result;
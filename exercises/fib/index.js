// --- Directions
// Print out the n-th entry in the fibonacci series.
// The fibonacci series is an ordering of numbers where
// each number is the sum of the preceeding two.
// For example, the sequence
//  [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
// forms the first ten entries of the fibonacci series.
// Example:
//   fib(4) === 3

function memoize(fn) {
  const cache = {};

  return function(...args) {
    if (cache[args]) {
      return cache[args];
    }
    
    const result = fn.apply(this, args);
    cache[args] = result;

    return result;
  }
}

function slowFib(n, c = 2) {
  if(n < 2) return n;
 
  return fib(n-1) + fib(n-2);
}
const fib = memoize(slowFib);
fib(5)

module.exports = fib;


// let sum = 0;
// let prev = 0;
// let current = 1;
// if (n === 1) {
//   return 1;
// }
// for (let i = 2; i <= n; i++) {
//   sum = prev + current;
//   prev = current;
//   current = sum;
// }
// return sum;
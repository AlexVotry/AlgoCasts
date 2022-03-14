// --- Directions
// Write a function that accepts a positive number N.
// The function should console log a pyramid shape
// with N levels using the # character.  Make sure the
// pyramid has spaces on both the left *and* right hand sides
// --- Examples
//   pyramid(1)
//       '#'
//   pyramid(2)
//       ' # '
//       '###'
//   pyramid(3)
//       '  #  '
//       ' ### '
//       '#####'

function pyramid(n, row = 0, level = '') {
  if (row === n) {
    return;
  }
  const columns = 2 * n - 1;
  if (level.length === columns) {
    console.log(level);
    return pyramid(n, row + 1);
  }

  const midpoint = Math.floor((columns) / 2);
  let add;
  if (midpoint - row <= level.length && midpoint + row >= level.length) {
    add = '#';
  } else {
    add = ' ';
  }
  pyramid(n, row, level + add);

}

module.exports = pyramid;


// function pyramid(n) {
//   let columns = n + (n - 1);

//   for (let row = 1; row <= n; row++) {
//     let pyramid = '';
//     let hash = row + (row - 1);
//     let spaces = columns === hash ? 0 : (columns - hash) / 2;

//     for (let col = 1; col <= columns; col++) {
//       if (col <= spaces || col > spaces + hash) {
//         pyramid += ' ';
//       } else {
//         pyramid += '#';
//       }
//     }
//     console.log(pyramid);
//   }
// }
// --- Directions
// Write a function that accepts a string.  The function should
// capitalize the first letter of each word in the string then
// return the capitalized string.
// --- Examples
//   capitalize('a short sentence') --> 'A Short Sentence'
//   capitalize('a lazy fox') --> 'A Lazy Fox'
//   capitalize('look, it is working!') --> 'Look, It Is Working!'

function capitalize(str) {
 const array = str.split(' ');
 let result = [];
 array.forEach(word => {
  const cap = word[0].toUpperCase() + word.substr(1);
  result.push(cap);
 });

  return result.join(' ');
}

module.exports = capitalize;

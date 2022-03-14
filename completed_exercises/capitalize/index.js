// --- Directions
// Write a function that accepts a string.  The function should
// capitalize the first letter of each word in the string then
// return the capitalized string.
// --- Examples
//   capitalize('a short sentence') --> 'A Short Sentence'
//   capitalize('a lazy fox') --> 'A Lazy Fox'
//   capitalize('look, it is working!') --> 'Look, It Is Working!'

// function capitalize(str) {
//   let result = str[0].toUpperCase();

//   for (let i = 1; i < str.length; i++) {
//     if (str[i - 1] === ' ') {
//       result += str[i].toUpperCase();
//     } else {
//       result += str[i];
//     }
//   }

//   return result;
// }

// function capitalize(str) {
//   const result = str.split(' ');
//   final = [];
//   result.forEach(word => {
//     const first = word[0].toUpperCase();
//     const rest = word.replace(word[0], first);
//     final.push(rest);
//   })
//   return final.join(' ');
// }



// function capitalize(str) {
//   const words = [];
//
//   for (let word of str.split(' ')) {
//     words.push(word[0].toUpperCase() + word.slice(1));
//   }
//
//   return words.join(' ');
// }


const capitalize = (str) => {
  const strArr = str.split(' ');
  let result = '';
  strArr.forEach(word => {
    result += `${word.replace(word[0], word[0].toUpperCase())} `;
  })

  return result.trimEnd();
}

module.exports = capitalize;

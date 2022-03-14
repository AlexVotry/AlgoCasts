// --- Directions
// Given a string, return the character that is most
// commonly used in the string.
// --- Examples
// maxChar("abcccccccd") === "c"
// maxChar("apple 1231111") === "1"

function maxChar(str) {
  const obj = {};
  let max = str.substr(0,1);
  str.split('').forEach(char => {
    if(obj[char]) {
      obj[char] ++;
    } else {
      obj[char] = 1;
    };
    max = obj[max] < obj[char] ? char : max;
  });

  return max;
}

module.exports = maxChar;

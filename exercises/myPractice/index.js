class Node {
  constructor() {
    this.keys = new Map();
    this.end = false;
    this.setEnd = function() {
      this.end = true;
    };
    this.isEnd = function() {
      return this.end;
    }
  };
};


class Trie {
  constructor() {
    this.root = new Node();
  }

  add = function (input, node = this.root) {
    if (!input.length) {
      node.setEnd();
      return;
    }
    if (!node.keys.has(input[0])) {
      node.keys.set(input[0], new Node());
    }
    return this.add(input.substr(1), node.keys.get(input[0]));
  }

  isWord = function(word) {
    let node = this.root;
    while (word.length > 1) {
      if (!node.keys.has(word[0])) return false;
      node = node.keys.get(word[0]);
      word = word.substr(1);
    };

    return (node.keys.has(word) && node.keys.get(word).isEnd());
  };

  print = function() {
   const words = [];
   let search = function(node, string) {
     if (node.keys.size) {
       node.keys.forEach((val, key) => {
         search(node.keys.get(key), string.concat(key));
       });
       if (node.isEnd()) words.push(string);
     } else {
       string.length ? words.push(string) : undefined;
       return;
     }
   }

   search(this.root, '');
   return words.length ? words : null;

  }
}


// myTrie = new Trie();
// myTrie.add('ball');
// myTrie.add('bat');
// myTrie.add('doll');
// myTrie.add('dork');
// myTrie.add('dorm');
// myTrie.add('send');
// myTrie.add('sense');

// console.log(myTrie.isWord('ball'));
// console.log(myTrie.isWord('bas'));
// console.log(myTrie.isWord('dor'));

// console.log(myTrie.print());

const teams = { Blue: new Set(), Red: new Set(), Green: new Set(), Purple: new Set(), Gold: new Set() };
const players = ['1','2','3','4','5','6','7','8','9','10','11', '12', '1', '2', '4'];

function createTeams() {
  const len = players.length;
  let noOfTeams = 0;

  if (len < 6) {
    noOfTeams = len;
  }
  if (len > 9) {
    noOfTeams = 5;
  } else {
    noOfTeams = Math.floor(len / 2);
  }

  while (players.length) {
    for (let team in teams) {
       // console.log(team);
       const eachTeam = players.splice(0, 1);
       if (eachTeam.length) teams[team].add(...eachTeam);
     }
  }

  console.log(teams);


}

const onlyUnique = (value, index, self) => {

  console.log('val:', value, "i:", index, 'self:', self);
  return self.indexOf(value) === index;
}
// createTeams();

console.log( 'unique:', players.filter(onlyUnique));
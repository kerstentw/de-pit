let wordlist = require('./wordlist');

function generateName() {
  var noun = wordlist.nouns[Math.floor(Math.random()*wordlist.nouns.length)];
  var adjective = wordlist.adjectives[Math.floor(Math.random()*wordlist.adjectives.length)];

  return `${adjective}_${noun}`;
}

module.exports = {
  generateName: generateName
}

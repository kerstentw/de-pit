let bcs = require("../utils/commodities/base_commodities");
let sha256 = require("../utils/hashlib/sha256");

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};


/*
  Does Shit with cards
*/

function CardHandler(_room_details) {
  /* Instantiate after room is readied
  room_details = {
    player_num: <Integer <= 7>,
    players: [<player_id>,]

  }
  */

  let chooseCommodities = () => {
    //randomly choose 3 unique asssets
    let comm_keys = new Array();
    let temp_keys = Object.keys(bcs.BASE_COMMODITIES);

    if (_room_details == 7) {
      return {
        imgs: temp_keys.map(data=>bcs.COMMODITIES_IMAGES[data]),
        comm_vals: temp_keys.map(data=>bcs.BASE_COMMODITIES[data]),
        comms: temp_keys
      }
    }

    // get random keys
    for (let i = 0; i < _room_details.player_num; i++){
      comm_keys.push(temp_keys.pop(Math.floor(Math.random() * temp_keys.length)));
    }

    return comm_keys.map(data_o=> {
      return {
        [data_o]: {
          imgs: comm_keys.map(data=>bcs.COMMODITIES_IMAGES[data]),
          comm_vals: comm_keys.map(data=>bcs.BASE_COMMODITIES[data]),
          comms: comm_keys
        }
      }
    });
  }

  let generateTokenId = async ()=> {
    let time_salt = String(new Date().getTime());
    let random_salt = Math.floor(Math.random() * 10000);
    let token_id = await sha256(`${time_salt}_${random_salt}`);

    return token_id;
  }

  let generateCards = async (_commodities) => {
    let cards = new Array();
    let comm_keys = Object.keys(_commodities);
    let num_cards = comm_keys.length * 9;

    for (let i = 0; i < comm_keys.length; i++) {
      for (let ii = 0; ii < 9; ii++){
        tokenId = await generateTokenId();
        cards.push({
          ..._commodities[i],
          token_id: tokenId
        });

      }
    }

    return cards;
  }

  let shuffleDeck = (cards) => {
    return shuffle(cards);
  }

  let generateDeck = async (_player_number) => {
    // generate array of NFT's
    // Split Array into player hands
		console.log("GOT PLAYER NUM TO GEN: ", _room_details)
    let commodities = chooseCommodities();



    let cards = await generateCards(commodities);
    let deck = shuffleDeck(cards);

    return deck;
  }

  let dealDeck = (_deck) => {

    let playersObject = new Object();

    let increment = 9; // slice(n,n_excluded)
    const INCRE_OFFSET = 9;

    for (let i = 0; i < _room_details.players.length; i++) {
      playersObject[_room_details.players[i]] = _deck.slice(increment-INCRE_OFFSET,increment);
      increment + INCRE_OFFSET; // This is some hack crap.
    }

    return playersObject;
  }

  let createGame = async () => {
		console.log("CREATING DECKS")

    let deck = await generateDeck();
		console.log("DEBUG: GOTDECK", deck);

    let players = dealDeck(deck);
    console.log("DEALING... ", players)

    return players;
  }

  return {
    createGame: createGame
  }

}

module.exports = CardHandler;

var nameGen = require('./src/utils/identity/name_generator');
var colorGen = require('./src/utils/identity/ColorHexes');
var gRoomHandlers = require('./src/state_handlers/room_handlers');
var cardHandler = require('./src/state_handlers/card_handler');


async function testCards() {
  console.log("Testing cards Handlers")
  let test_ch = new cardHandler({player_num: 3, players: ["a","b","c "]});
  test_deck = await test_ch.createGame();
  return test_deck;
}

async function testplayerHandler() {

}

async function testRoomHandler() {
  console.log("Testing Rooms Handlers")
  let romH = new gRoomHandlers();
  rooms = romH.getAllRooms();

  romH.addPlayer("room_a","FooBar");
  console.log(rooms)

  romH.removePlayer("room_a","FooBar");
  console.log(rooms)

  return rooms;
}

async function runTests() {
  let cards = await testCards();
  let rooms = await testRoomHandler();

  console.log("cards", cards);
  console.log("rooms", rooms)
}

runTests();

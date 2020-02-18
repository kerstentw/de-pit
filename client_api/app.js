var express = require('express');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var nameGen = require('./src/utils/identity/name_generator');
var colorGen = require('./src/utils/identity/ColorHexes');
var gRoomHandlers = require('./src/state_handlers/room_handlers');
var cardHandler = require('./src/state_handlers/card_handler');
var GameLoopHandler = require('./src/state_handlers/GameLoopHandler');

var Web3 = require("web3");

var ethers = require('ethers');

const DEV_PROVIDER = "http://localhost:8545";
const FUNDER = "0x366d3143bB5197763Ed25d7eF33A771FaF333C19";

const DEPIT_CONTROLLER_ADDR = "";
// Random Helper

const COUNTDOWN_INTERVAL = 30000;

const SOCK_TO_PLAYER = {};
const SOCK_TO_ROOM = {};
const RUNNING_GAMES = {};


/*
  Random Helpers
*/

function createWallet(){
  return ethers.Wallet.createRandom();
}

function shouldStart(_room) {
    return _room.players.length >= _room.min_p? true: false;
}

var app = express();

// Shitty Global State Manager:

var RoomHandler = new gRoomHandlers();


app.use(express.static('client/static'));

server.listen(8090);
console.log("SOCKET ON: ", 8090)
// WARNING: app.listen(80) will NOT work here!

/*

*/

function historicalMsgHandler() {
  var previousMessages = [];

  this.appendMessage= (_msg) => {
    if (previousMessages.length > 10) {
      previousMessages = previousMessages.slice(1,10)
    }

    previousMessages.push(_msg);
  }

  this.getMessages = () => {
    return previousMessages;
  }
}

var message_recorder = new historicalMsgHandler();

/*
  For the sake of speed we are going to mash all of our socket message handling
  here.
*/

io.on('connection', function (socket) {

  const new_player_id = nameGen.generateName();
  SOCK_TO_PLAYER[socket.id] = new_player_id;

  socket.join("global");

  socket.emit("init_page", {
    player_id: new_player_id,
    rooms: RoomHandler.getAllRooms(),
    contract_addr: DEPIT_CONTROLLER_ADDR
  }
  );

  socket.on("fund_req", (_msg) => {
    let web3 = new Web3(DEV_PROVIDER);


  })

  socket.on("get_wallet", (_msg) => {
    socket.emit("send_wallet",{wallet: createWallet()});
  });

  socket.on("join_room", (_msg) => {
      socket.join(_msg.room_id);

      SOCK_TO_ROOM[socket.id] = _msg.room_id;

      RoomHandler.addPlayer(_msg.room_id, _msg.player_id);

      socket.emit("lobby_joined", {room_id: _msg.room_id});

      io.emit("reset_table", {
        rooms: RoomHandler.getAllRooms()
      });

      io.to(_msg.room_id).emit("player_room_join");

      // Countdown Manager

      let rooms = RoomHandler.getAllRooms();
      let shud_start = shouldStart(rooms[_msg.room_id]);


      /* Start Trigger */

      if (shud_start) {
        setTimeout( ()=>{
          io.to(_msg.room_id).emit("start")
        });

        RoomHandler.setRoomPlaying(_msg.room_id, true);

        io.emit("reset_table", {
          rooms: RoomHandler.getAllRooms()
        });

        let start_room = RoomHandler.getRoomByIDString(_msg.room_id);

        console.log({player_num: start_room.cur_players, players: start_room.players})

        let CardHandler = new cardHandler({player_num: start_room.cur_players, players: start_room.players});
        /*
        RUNNING_GAMES[_msg.room_id] = new GameLoopHandler(
          _msg.room_id,
          io.to(_msg.room_id).emit,
          CardHandler,
          RoomHandler,
          socket
        );*/


        // Placeholder -- DELETE ME

        socket.on("deck_req", async (msg) => {
          let decks = await CardHandler.createGame();
          console.log("DECKSSD", decks);
            io.to(_msg.room_id).emit("dealing_decks", {decks: decks});
        });



      }


  });


  socket.on("leave_room", (_msg)=>{


    console.log("LEAVE ROOM")
    RoomHandler.removePlayer(_msg.room_id, _msg.player_id);
    RoomHandler.playerUnReady(_msg.room_id, _msg.player_id);

    delete SOCK_TO_ROOM[socket.id];

    io.emit("reset_table", {
      rooms: RoomHandler.getAllRooms()
    });

    io.to(_msg.room_id).emit("player_room_leave");



  })


  socket.on("disconnect", async () => {
    let player_id = SOCK_TO_PLAYER[socket.id];
    let room_id = SOCK_TO_ROOM[socket.id];

    if (room_id && player_id){
        RoomHandler.removePlayer(room_id, player_id);
        RoomHandler.playerUnReady(room_id, player_id);
    }

    let rooms =  RoomHandler.getAllRooms()

    //THIS IS GARBAGE

    let cur_room = rooms[room_id];

    console.log ("DISCONNECT:", cur_room, cur_room.is_playing, (cur_room.min_p > cur_room.cur_players));

    if (cur_room && cur_room.is_playing && (cur_room.min_p > cur_room.cur_players)) {

      RoomHandler.hardReset(room_id);

      io.emit("reset_table", {
        rooms: RoomHandler.getAllRooms()
      });

      console.log("Disconnect WITH Reset")


      io.to(room_id).emit("hard_reset");

      return;

    }

    console.log("Disconnect no Reset")
    io.emit("reset_table", {
      rooms: RoomHandler.getAllRooms()
    });
  }); // End disconnection scope

}); // End Connection Scope


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client' + '/index.html');
});

app.listen(8080);

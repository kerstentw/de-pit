

var state = {
  has_started: false,
  in_room: false,
  default_page: "LobbySelect",
  installed_pages: ["LobbySelect", "GameSection", "LobbySection"],
  countdown_interval: ""
}


function manageWallet(_socket){
  let wallet = JSON.parse(window.localStorage.getItem("wallet"));

  if (wallet) {
    state.wallet = wallet;
  } else {
    _socket.emit("get_wallet");
  }
}


/*
  Main Objects
*/

function SocketEmmitters(_socket){
  this.joinRoom = (_player_id, _room_id)=>{
    return ()=>{
      console.log("Join broadcast", _room_id)
      _socket.emit("join_room", {player_id: _player_id, room_id: _room_id});
    }
  }

  this.leaveRoom = (_player_id, _room_id)=>{
    return ()=>{
      _socket.emit("leave_room", {player_id: _player_id, room_id: _room_id});
      state.in_room = false;
    }
  }

  this.readyUp = (_player_id, _room_id) => {
    return ()=>{
      _socket.emit("ready_up", {player_id: _player_id, room_id: _room_id});
    }
  }

  return {
    ...this
  }
}

function DomHandler(_socketListeners) {
  let hideAllPages = () => {
    for (page of state.installed_pages) {
      $(`#${page}`).hide();
    }
  }

  let selectPage = (_page) => {
    hideAllPages();
    $(`#${_page}`).show();
  }

  this.coercePage = (_page) => {
    selectPage(_page)
  }

  let generateRoomButton = (_room) => {
    return !_room.is_playing? `
       <button
         class="btn btn-success join_button"
         data-label="${_room.label}"
         data-min_p="${_room.min_p}"
         data-max_p="${_room.max_p}"
         data-cur_players="${_room.cur_players}"
         data-is_playing="${_room.is_playing}"
         data-channel="${_room.channel}"
       >
         Join
       </button>
    ` : "<button class='btn btn-danger'> Full </button>";
  }

  let formatRoomList = (_room_struct) => {
    let keys = Object.keys(_room_struct);

    let rows = keys.map(key=>{
        let room = _room_struct[key];

        return `
          <tr>
            <td>${room.channel}</td>
            <td>${room.label}</td>
            <td>${room.cur_players}/${room.min_p}</td>
            <td>${room.is_playing}</td>
            <td>${generateRoomButton(room)}
          </tr>
        `

    });

    let frame = `
            <div id="lobby_table_wrap" class="container">
              <table id="lobby_table">
              <thead>
                <th> Room Name </th>
                <th> Room Type </th>
                <th> Player Count </th>
                <th> Is Playing? </th>
                <th></th>
              </thead>

              <tbody>
                ${rows.join("")}
              </tbody>
              </table>
            </div>`

    return frame;
  }

  this.setRooms = () => { //lobby room list
    $("#lobby_list").html(formatRoomList(state.rooms));
    $("#lobby_table").DataTable();

    $(".join_button").on('click', (evt)=>{
      let room_id = $(evt.target).data('channel');
      _socketListeners.joinRoom(state.player_id, room_id)();
    });
  }


  let createPlayerTable = () => {
  //  console.log("LOBBY: ", state.rooms[state.in_room].players);
    let frame = `
    <table class="table">
      ${state.rooms[state.in_room].players.map(data=>`<tr>${data}</tr>`).join("<br/>")}
    </table>`

    console.log(frame);
    return frame;
  }

  this.setCountdown = () => {
    interval = state.countdown_interval;
    _int = interval / 1000;

    kill_int = setInterval(()=>{
      $("#countdown_count").html(`<h3>${_int}</h3>`);
      _int -= 1;
    }, 1000);

    return kill_int;


  }


  this.setLobby = () => {
    $("#lobby_players_list").html(createPlayerTable());

    $("#lobby_exit_button").on("click",()=>{
      _socketListeners.leaveRoom(state.player_id, state.in_room)();

      state.in_room = false;
      selectPage("LobbySelect");
    });

    $("#lobby_ready_button").on("click",()=>{
      _socketListeners.readyUp(state.player_id, state.in_room)();
    });

    $("#countdown_count").text(`${state.rooms[state.in_room].players.length}/${state.rooms[state.in_room].min_p}`);

  }

  let setListeners = () => {


  }

  this.init = () => {
    // to-do: put this in state
    hideAllPages();
    selectPage(state.default_page);
    setListeners();
    $("#player_name").text(state.player_id);
  }

  return {
    ...this
  }

}

/*
  Main App.
*/

function DePitApp(_socket) {

  let socketListeners = new SocketEmmitters(_socket);
  let domHandler = new DomHandler(socketListeners);

  let setSocketListeners = () => {
      _socket.on("init_page", (msg)=>{
        state.rooms = msg.rooms;
        state.player_id = msg.player_id;
        state.depit_contract_addr = msg.contract_addr;

        domHandler.init();
        domHandler.setRooms();
      })

     _socket.on("send_wallet",(msg)=>{
       window.localStorage.setItem("wallet", JSON.stringify(msg.wallet));
       state.wallet = msg.wallet;
     })

     _socket.on("reset_table", (msg)=>{
       console.log("reset_recv", msg);
       state.rooms = msg.rooms;
       domHandler.setRooms();
     })

     _socket.on("lobby_joined", (msg) => {
       state.in_room = msg.room_id;
       domHandler.coercePage("LobbySection");
       domHandler.setLobby();
     })

     _socket.on("player_readied",()=>{
       console.log("Player Readied");
     })

     _socket.on("player_room_join", ()=>{
       domHandler.setLobby();
     })

     _socket.on("player_room_leave", ()=>{
       domHandler.setLobby();
     })

    _socket.on("start", ()=>{
      state.has_started = true;
      domHandler.coercePage("GameSection");
      socket.emit("deck_req");

    });

    _socket.on("dealing_decks", (msg)=>{
      // nft_contract  = new NFTHelper(PROVIDER);
      // let enum_nft_contract = NFTHelper.init();
      // enum_nft_contract.dealDecks(msg.decks);

      // Placeholder: DELETE ME
      let mydeck = msg.decks[state.player_id];
      console.log("ALL DECKS,", msg.decks);
      let keys = Object.keys(mydeck);

      console.log(mydeck);

      $("#cards").html(
         keys.map(data=>{
           return `<img class="game_card" data-type=${data} src="imgs/cards/${Object.keys(mydeck[data])[0]}.png"/>`
         }).join("")
      )


    })

    _socket.on("hard_reset",()=>{
        alert("Player has Left, Game over.  You win, I guess.");
        state.cur_room = false;
        domHandler.setRooms();
        window.location.reload();
    })




   }

 this.init = () => {
   setSocketListeners();
   manageWallet(_socket);
 }

 return {
   ...this
 }

}

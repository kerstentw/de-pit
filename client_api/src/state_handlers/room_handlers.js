
/*
  Creates an API for the handling of Rooms
*/




function gameRoomHandler() {

  const INITIAL_STATE = {
    room_a: {channel: "room_a", max_p: 4, min_p: 3, label:  "Small Room",  is_playing: false, chat_id: 0, cur_players: 0,are_ready: [], players: []},
    room_b: {channel: "room_b", max_p: 4, min_p: 3, label:  "Small Room",  is_playing: false, chat_id: 1, cur_players: 0,are_ready: [], players: []},
    room_c: {channel: "room_c", max_p: 5, min_p: 4, label:  "Medium Room", is_playing: false, chat_id: 2, cur_players: 0,are_ready: [], players: []},
    room_d: {channel: "room_d", max_p: 5, min_p: 5, label:  "Medium Room", is_playing: false, chat_id: 3, cur_players: 0,are_ready: [], players: []},
    room_e: {channel: "room_e", max_p: 7, min_p: 6, label: "Big Room",     is_playing: false, chat_id: 4, cur_players: 0,are_ready: [], players: []},
    room_f: {channel: "room_f", max_p: 7, min_p: 7, label:  "Big Room",    is_playing: false, chat_id: 5, cur_players: 0,are_ready: [], players: []}
  }

  let GAME_ROOMS = {
    room_a: {channel: "room_a", max_p: 4, min_p: 3, label:  "Small Room",  is_playing: false, chat_id: 0, cur_players: 0,are_ready: [], players: []},
    room_b: {channel: "room_b", max_p: 4, min_p: 3, label:  "Small Room",  is_playing: false, chat_id: 1, cur_players: 0,are_ready: [], players: []},
    room_c: {channel: "room_c", max_p: 5, min_p: 4, label:  "Medium Room", is_playing: false, chat_id: 2, cur_players: 0,are_ready: [], players: []},
    room_d: {channel: "room_d", max_p: 5, min_p: 5, label:  "Medium Room", is_playing: false, chat_id: 3, cur_players: 0,are_ready: [], players: []},
    room_e: {channel: "room_e", max_p: 7, min_p: 6, label: "Big Room",     is_playing: false, chat_id: 4, cur_players: 0,are_ready: [], players: []},
    room_f: {channel: "room_f", max_p: 7, min_p: 7, label:  "Big Room",    is_playing: false, chat_id: 5, cur_players: 0,are_ready: [], players: []}
  }

  this.getAllRooms = ()=>{
    return GAME_ROOMS;
  }

  this.playerReady = (_room_id, _player_id) => {
    if (GAME_ROOMS[_room_id].are_ready.indexOf(_player_id) < 0){
      GAME_ROOMS[_room_id].are_ready.push(_player_id);
    }
  }

  this.playerUnReady = (_room_id, _player_id) => {
    if (!_room_id){
      return
    }
    player_idx = GAME_ROOMS[_room_id].are_ready.indexOf(_player_id);
    GAME_ROOMS[_room_id].are_ready.pop(player_idx);

    //if (GAME_ROOMS[_room_id] && GAME_ROOMS[_room_id].are_ready.indexOf(_player_id) > -1){
    //  GAME_ROOMS[_room_id].are_ready.pop(GAME_ROOMS[_room_id].are_ready.indexOf(_player_id));
    //}
  }

  this.getRoomByIDString=(_room_id)=>{
    return GAME_ROOMS[_room_id];
  }

  this.isRoomPlaying = (_room_id) => {
    return GAME_ROOMS[_room_id]? GAME_ROOMS[_room_id].is_playing : false;
  }

  this.setRoomPlaying = (_room_id, is_playing) => {
    GAME_ROOMS[_room_id].is_playing = Boolean(is_playing);
    return;
  }

  this.hardReset = (_room_id) => {
    GAME_ROOMS[_room_id] =  INITIAL_STATE[_room_id];
    
  }

  this.getRoomChatId = (_room_id) => {
    return GAME_ROOMS[_room_id].chat_id;
  }

  this.addPlayer = (_room_id, _player_id) => {
    GAME_ROOMS[_room_id].players.push(_player_id);
    GAME_ROOMS[_room_id].cur_players = GAME_ROOMS[_room_id].players.length;
  }

  this.removePlayer = (_room_id, _player_id) => {
    if (GAME_ROOMS[_room_id]) {
      GAME_ROOMS[_room_id].players.pop(GAME_ROOMS[_room_id].players.indexOf(_player_id));
      GAME_ROOMS[_room_id].cur_players = GAME_ROOMS[_room_id].players.length;
    }
    if (GAME_ROOMS[_room_id] && GAME_ROOMS[_room_id].are_ready.indexOf(_player_id) > -1){
      GAME_ROOMS[_room_id].are_ready.pop(GAME_ROOMS[_room_id].are_ready.indexOf(_player_id));
    }

  }

  this.addPlayer

  return {
    ...this
  };

}




module.exports = gameRoomHandler; // is default

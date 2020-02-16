function playerHandler() {

  const TOTAL_STATE = {
    curr_players_playing: 0;
    curr_players_online: 0;
  }
  const PLAYERS = {} // maps to current Room

  let addPlayer = (_player_id, _room_id) => {
    PLAYERS[_player_id] = _room_id;
  }

  let removePlayer = (_player_id) => {
    delete PLAYERS[_player_id]; // This is trash.  Fuck you.
  }

  return {
    ...this
  }
}

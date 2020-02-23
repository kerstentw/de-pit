/*
 This object is a global game state object which updates player states
 and acts as a gossip for the entire room.
*/

function GameLoopHandler(
      _room_id,
      _room_emitter,
      _card_handler,
      _room_handler,
      _socket
    ) {

  this.global_state = {}

  let phases = {
    PREP: "prep",
    PLAY: "play",
    END: "end"
  }

  let ready = false;
  this.phase = "preparation";
  let checklist = {}




  this.playerCheckin = () => {

  }

  let setListeners = () => {
    
  }



  this.startLoop = async () => {
    // Broadcast the decks.  Wait for clients to create NFT's.

    let decks = await _card_handler.createGame();

  }

  return {
    ...this
  }

}

module.exports = GameLoopHandler;

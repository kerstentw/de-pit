function GameLoopHandler(_room_id, _room_emitter, _card_handler, _room_handler, _socket) {
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

  this.startLoop = async () => {
    // Broadcast the decks.  Wait for clients to create NFT's.
    
    let decks = await _card_handler.createGame();

  }

  return {
    ...this
  }

}

module.exports = GameLoopHandler;

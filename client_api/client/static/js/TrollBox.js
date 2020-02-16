/*
  MESSAGE HANDLER
*/

function MessageHandler(_msg_list_id) {
  let curr_messages = [];

  let getMonth = {
    0: "Jan.",
    1: "Feb.",
    2: "Mar.",
    3: "Apr.",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug",
    8: "Sep.",
    9: "Oct.",
    10: "Nov.",
    11: "Dec."

  }

  let formatDateForMsg = (_dateNum) => {
    data_obj = new Date(_dateNum);
    return `
      ${getMonth[data_obj.getUTCMonth()]} ${data_obj.getUTCDay()} ${data_obj.getUTCFullYear()}

      ${data_obj.getHours()}:${data_obj.getMinutes()}

    `
  }

  let formatSingleMsg = (_msg_obj) => {
    return `

      <div style="" class="chatBox">
        <strong style="color:#${_msg_obj.color}">${_msg_obj.sender}</strong>
        <p style="font-size:15px">${_msg_obj.msg}</p>
        <h6 style="font-size: 10px;">${formatDateForMsg(_msg_obj.time)}<h6>
      </div>
    `;
  }

  this.handleMsg = (_msg_obj) => {
    curr_messages.push(_msg_obj);
    let message_doms = curr_messages.map(data=>formatSingleMsg(data));
    $(`#${_msg_list_id}`).html(message_doms.join(""));
  }

  this.processManyMsgs = (_msg_array) => {
    curr_messages = _msg_array;
    let message_doms = curr_messages.map(data=>formatSingleMsg(data));
    $(`#${_msg_list_id}`).html(message_doms.join(""));
  }

  return {
    ...this
  }
}



/*

CHAT APP OBJECT

*/


function ChatApp(_app_id, _host){


  client_name = "";
  client_color = "";

  let config = {
    msg_submit_id: "msg_submit",
    msg_input_id: "msg_input",
    chat_view_id: "chat_view",
    chat_view_wrap: "chat_view_wrap"
  }

  let message_handler = new MessageHandler(config.chat_view_id);

  let setScrollBottom = () => {
    var objDiv = document.getElementById(config.chat_view_wrap);
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  let buildDom = (_app_id) => {

    let source = `

    <style>
    #mainTrollWrap {
      max-width: 100%;
      overflow-x: hidden;
      padding: 10px;
      border: 1px solid white;
    }

    #chat_view_wrap {
      height: 85%;
      max-height: 80%;
      overflow-y: scroll;
      height: 90%;
      padding: 10px
    }

    /* width */
    ::-webkit-scrollbar {
      width: 5px;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey;
      border-radius: 5px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #DDDDDD;
      border-radius: 5px;
    }

    #msg_input_wrap {

    }

    .chatBox {
      padding: 8px;
      border: 1px solid #DDDDDD;
      margin-bottom: 15px;
      border-radius: 5px;
      background-color: rgba(0,0,0,0.25);
      color: white;
    }

    </style>

    <div id="mainTrollWrap">
        <h1 style="color:white">Troll Box</h1>
      <div id="chat_view_wrap">
        <div id="${config.chat_view_id}">
        </div>
      </div>

      <div id="msg_input_wrap">

        <form>
          <div id="chatInputWrap" class="row">
          <input id="${config.msg_input_id}" type="text" placeholder="Enter Message Here" class="col-md-8" style="font-size: 17px"/>
          <input id="${config.msg_submit_id}" type="submit" class="col-md-4" maxlength="300"></input>
          </div>
          <div style="color: white">Your Name: <strong><span id="username"></span></strong></div>
        </form>
      </div>
    </div>
    `

    $(`#${_app_id}`).html(source);
    $(`#${config.msg_submit_id}`).on('keyup', (evt) => {
      evt.preventDefault();
    })
  }

  let sendMsgListener = (_socket) => {

    $(`#${config.msg_submit_id}`).on('click', function (ev) {
      ev.preventDefault();
      let msg_recv = $(`#${config.msg_input_id}`).val();

      if (msg_recv.length < 1) {
        return;
      }

      let var_struct = {msg: msg_recv, sender: client_name, time: new Date().getTime(), color: client_color}
      message_handler.handleMsg(var_struct);
      _socket.emit("troll_new_msg", var_struct);
      $(`#${config.msg_input_id}`).val("");
      setScrollBottom();


      return;
    });
  }

  let bindMsgUpdate = (_sock) => {
    _sock.on('mc_up', function (data) {
      console.log("received MSG", data)
      message_handler.handleMsg(data);
    });

    setScrollBottom();
  }

  let bindOnHandShake = (_sock) => {
    _sock.on('troll_handshake', function (data) {
      console.log("HS: ", data)
      client_name = data.your_name || "unknown";
      client_color = data.color || "FFFFFF";
      $("#username").html(`<span style="color:${client_color}">${client_name}</span>`);
      message_handler.processManyMsgs(data.prev_msgs)
      setScrollBottom();

    })

  }

  this.init = (_socket) => {
    bindOnHandShake(_socket);
    buildDom(_app_id);
    bindMsgUpdate(_socket);
    sendMsgListener(_socket);
  }

  return {
    ...this
  }

}

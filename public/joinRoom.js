function joinRoom(roomName) {
  // send to server the room's name
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user">`;
  });

  nsSocket.on("historyToRender", (history) => {
    const messageList = document.querySelector("#messages");
    messageList.innerHTML = "";

    history.forEach((msg) => {
      const newMsgHTML = buildMessageHTML(msg);
      messageList.innerHTML = messageList.innerHTML + newMsgHTML;
    });

    messageList.scrollTo(0, messageList.scrollHeight);
  });

  nsSocket.on("updateNumOfMems", (newNumMems) => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumMems} <span class="glyphicon glyphicon-user">`;
    document.querySelector(".curr-room-text").innerText = roomName;
  });
}

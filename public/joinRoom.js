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

  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", (e) => {
    let messages = Array.from(document.getElementsByClassName("message-text"));
    messages.forEach((msg) => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        msg.parentElement.parentElement.style.display = "none";
      } else {
        msg.parentElement.parentElement.style.display = "block";
      }
    });
  });
}

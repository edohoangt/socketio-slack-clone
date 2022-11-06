// join a specified namespace

function joinNs(endpoint) {
  if (nsSocket) {
    nsSocket.close();
    document
      .querySelector("#user-input")
      .removeEventListener("submit", formSubmmission);
  }

  // connect to a namespace
  nsSocket = io(`http://localhost:9000${endpoint}`, {
    query: {
      username,
    },
  });

  // receive all rooms in the namespace
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";

    // populate rooms info on UI
    nsRooms.forEach((room) => {
      let glyph;
      if (room.privateRoom) {
        glyph = "lock";
      } else {
        glyph = "globe";
      }
      roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
    });

    // add click listener to each room
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach((elem) => {
      elem.addEventListener("click", (e) => {
        joinRoom(e.target.innerText);
      });
    });

    // add client to the default room
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    joinRoom(topRoomName);
  });

  nsSocket.on("messageCToC", (fullMsg) => {
    document.querySelector("#messages").innerHTML += buildMessageHTML(fullMsg);
  });

  document
    .querySelector(".message-form")
    .addEventListener("submit", formSubmmission);
}

function formSubmmission(event) {
  event.preventDefault();
  const newMessage = document.querySelector("#user-message").value;
  nsSocket.emit("newMessageToOtherClient", { text: newMessage });
}

function buildMessageHTML(fullMsg) {
  const convertedDate = new Date(fullMsg.time).toLocaleString();

  const msgHTML = `
        <li>
          <div class="user-image">
            <img src="${fullMsg.avatar}" />
          </div>
          <div class="user-message">
            <div class="user-name-time">${fullMsg.username} <span>${convertedDate}</span></div>
            <div class="message-text">${fullMsg.text}</div>
          </div>
        </li>`;

  return msgHTML;
}

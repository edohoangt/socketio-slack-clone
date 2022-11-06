const express = require("express");
const app = express();
const socketio = require("socket.io");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

let namespaces = require("./data/namespaces");

io.on("connection", (socket) => {
  // send back all namespaces info
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });

  // use 'socket' to send to only this client, instead of 'io'
  socket.emit("nsList", nsData);
});

// all namespaces listen for new connection
namespaces.forEach((ns) => {
  io.of(ns.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has join ${ns.endpoint}.`);
    nsSocket.emit("nsRoomLoad", ns.rooms);

    nsSocket.on("joinRoom", (roomToJoin, updateNumOfMemCallback) => {
      nsSocket.join(roomToJoin);
      io.of(ns.endpoint)
        .in(roomToJoin)
        .clients((err, clients) => {
          updateNumOfMemCallback(clients.length);
        });

      const nsRoom = ns.rooms.find((room) => {
        return room.roomTitle === roomToJoin;
      });

      nsSocket.emit("historyToRender", nsRoom.history);

      // send the new number of members to all sockets in the room
      io.of(ns.endpoint)
        .in(roomToJoin)
        .clients((_, clients) => {
          io.of(ns.endpoint)
            .in(roomToJoin)
            .emit("updateNumOfMems", clients.length);
        });
    });

    nsSocket.on("newMessageToOtherClient", (msg) => {
      //   console.log(nsSocket.rooms);
      // 'nsSocket.rooms' will contain 2 rooms: one for itself, one is the actual chat room
      // send this msg to all sockets in the room that this socket is in
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "$placeholder",
        avatar: "https://via.placeholder.com/30",
      };

      // get room object to add msg to history
      const nsRoom = ns.rooms.find((room) => {
        return room.roomTitle === roomTitle;
      });
      nsRoom.addMessage(fullMsg);

      // io.of(ns.endpoint): socket of the whole namespace
      // nsSocket: socket of the current client connected
      io.of(ns.endpoint).to(roomTitle).emit("messageCToC", fullMsg);
    });
  });
});

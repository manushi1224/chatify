const dotenv = require("dotenv").config();

const io = require("socket.io")(8900, {
  cors: {
    origin: `${process.env.API_URL}`,
  },
});

let users = [];

function addUser(userId, socketId) {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });

  console.log(users);
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  // connect
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // send message
  socket.on("sendMessage", ({ senderId, recieverId, text }) => {
    const user = getUser(recieverId);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
      createdAt: Date.now(),
    });
  });

  // send notification
  socket.on(
    "sendNotification",
    ({ senderId, recieverId, text, userName, type }) => {
      const user = getUser(recieverId);
      io.to(user.socketId).emit("getNotification", {
        senderId,
        text,
        userName,
        type,
      });
    }
  );

  // join room
  socket.on("join:room", (data) => {
    const user = getUser(data.senderId);

    io.to(user.socketId).emit("user:joined", {
      senderId: data.senderId,
      conversationId: data.conversationId,
      id: user.socketId,
    });
    socket.join(data.conversationId);
    // console.log(socket.rooms);
    io.to(user.socketId).emit("join:room", data);
  });

  // incoming call notification
  socket.on("call:notification", (data) => {
    console.log("incoming call...", data);
    const user = getUser(data.recieverId);
    io.to(user.socketId).emit("call:notification", data);
  });

  // call accept notification
  socket.on("call:accept", (data) => {
    console.log("call accepted...", data);
    const user = getUser(data.recieverId);
    io.to(user.socketId).emit("call:accept", data);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected.");
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

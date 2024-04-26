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
  socket.on("sendMessage", ({ senderId, recieverId, message }) => {
    const user = getUser(recieverId);
    if (user === undefined) return console.log("User not found.");
    io.to(user.socketId).emit("getMessage", {
      senderId,
      message,
      createdAt: Date.now(),
    });
  });

  // send notification
  socket.on(
    "sendNotification",
    ({ senderId, recieverId, text, userName, type }) => {
      const user = getUser(recieverId);
      if (user === undefined) return console.log("User not found.");
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
    const reciever = getUser(data.recieverId);
    if (user === undefined) return console.log("User not found.");
    if (reciever === undefined) return console.log("Reciever not found.");
    io.to(reciever.socketId).emit("user:joined", {
      senderId: data.senderId,
      conversationId: data.conversationId,
      id: user.socketId,
    });
    socket.join(data.conversationId);
    io.to(user.socketId).emit("join:room", data);
  });

  // incoming call notification
  socket.on("call:notification", (data) => {
    console.log("incoming call...");
    const user = getUser(data.recieverId);
    const sender = getUser(data.senderId);
    if (user === undefined) {
      socket
        .to(sender.socketId)
        .emit("call:notification", { status: "offline", data });
      return console.log("User not found. in call notification.");
    }
    io.to(user.socketId).emit("call:notification", data);
  });

  // call accept notification
  socket.on("call:accept", (data) => {
    console.log("call accepted...");
    console.log(data.recieverId);
    const user = getUser(data.recieverId);
    if (user === undefined) return console.log("User not found.");
    io.to(user.socketId).emit("call:accept", data);
  });

  // video call
  socket.on("video_status", (data) => {
    console.log("video status");
    console.log(data.recieverId);
    const user = getUser(data.recieverId);
    if (user === undefined) return console.log("User not found.");
    io.to(user.socketId).emit("video_status", data);
  });

  // disconnect call
  socket.on("disconnect_call", (data) => {
    console.log("disconnect call");
    console.log(data.recieverId);
    const user = getUser(data.recieverId);
    if (user === undefined) return console.log("User not found.");
    io.to(user.socketId).emit("disconnect_call", data);
  });

  //remove user
  socket.on("removeUser", (userId) => {
    tempUsers = users.filter((user) => user.userId !== userId);
    io.emit("getUsers", tempUsers);
  });

  // disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected.");
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

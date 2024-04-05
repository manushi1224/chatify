const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require("socket.io");
const { connectDb } = require("./db/connectDb");

const app = express();
const server = require("http").Server(app);
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationsRoute");
const messageRoutes = require("./routes/messagesRoute");
const notificationRoutes = require("./routes/notificationRoute");

dotenv.config();
const port = process.env.PORT || 5000;

connectDb();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

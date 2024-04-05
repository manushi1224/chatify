const {
  createMessages,
  getAllMessages,
} = require("../controllers/messageConntroller");
const messageRouter = require("express").Router();

messageRouter.get("/:conversationId", getAllMessages);
messageRouter.post("/", createMessages);
module.exports = messageRouter;

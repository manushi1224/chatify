const {
  createMessages,
  getAllMessages,
} = require("../controllers/messageConntroller");
const checkAuth = require("../middleware/check-auth");
const messageRouter = require("express").Router();

messageRouter.get("/:conversationId", getAllMessages);

messageRouter.use(checkAuth);

messageRouter.post("/", createMessages);
module.exports = messageRouter;

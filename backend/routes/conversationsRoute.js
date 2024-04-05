const {
  createConversations,
  getAllConversationsById,
  getConversationById,
  getAllConversations,
  getAllConversationsByUser,
} = require("../controllers/conversationsController");

const conversationRouter = require("express").Router();

conversationRouter.get("/conversationByUser/:userId", getAllConversationsById);
conversationRouter.get("/allConversations/:userId", getAllConversations);
conversationRouter.get("/conversation/:conversationId", getConversationById);
conversationRouter.get("/conversation/user/:userId", getAllConversationsByUser);

conversationRouter.post("/", createConversations);
module.exports = conversationRouter;

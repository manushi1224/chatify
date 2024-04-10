const {
  createConversations,
  getAllConversationsById,
  getConversationById,
  getAllConversations,
  getAllConversationsByUser,
} = require("../controllers/conversationsController");
const checkAuth = require("../middleware/check-auth");

const conversationRouter = require("express").Router();

conversationRouter.get("/conversationByUser/:userId", getAllConversationsById);
conversationRouter.get("/allConversations/:userId", getAllConversations);
conversationRouter.get("/conversation/:conversationId", getConversationById);
conversationRouter.get("/conversation/user/:userId", getAllConversationsByUser);

conversationRouter.use(checkAuth);

conversationRouter.post("/", createConversations);
module.exports = conversationRouter;

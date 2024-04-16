const conversationModel = require("../models/conversation");
const userModel = require("../models/user");

const createConversations = async (req, res) => {
  const { senderId, recieverId } = req.body;
  console.log(senderId, recieverId);
  if (!senderId || !recieverId)
    return res
      .status(400)
      .json({ message: "Sender and reciever id required", success: false });
  try {
    const conversation = await conversationModel.create({
      members: [senderId, recieverId],
    });
    await conversation.save();

    return res.status(201).json({
      message: "Conversation created successfully",
      success: true,
      conversation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}`,
      success: false,
    });
  }
};

const getAllConversationsById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const conversations = await conversationModel.find({
      members: { $in: [userId] },
    });
    return res.status(200).json({
      message: "All conversations",
      success: true,
      conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}`,
      success: false,
    });
  }
};

const getConversationById = async (req, res) => {
  const conversationId = req.params.conversationId;
  try {
    const conversation = await conversationModel.findById(conversationId);
    return res.status(200).json({
      message: "Conversation found",
      success: true,
      conversation,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}`,
      success: false,
    });
  }
};

const getAllConversationsByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const conversations = await conversationModel.find({
      members: { $in: [userId] },
    });
    return res.status(200).json({
      message: "All conversations",
      success: true,
      conversations,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}`,
      success: false,
    });
  }
};

const getAllConversations = async (req, res) => {
  const currentUser = req.params.userId;
  try {
    const conversations = await conversationModel.find();
    pastUsers = [];
    conversations.forEach((conversation) => {
      if (conversation.members.includes(currentUser)) {
        temp = conversation.members.filter((member) => member !== currentUser);
        pastUsers.push(temp[0]);
      }
    });

    const allUsers = await userModel.find();
    newUsers = [];
    if (pastUsers.length === 0) {
      newUsers = allUsers.filter((user) => user._id.toString() !== currentUser);
    }

    newUsers = allUsers.filter(
      (user) =>
        !pastUsers.includes(user._id.toString()) &&
        user._id.toString() !== currentUser
    );
    return res.status(200).json({
      message: "All conversations",
      success: true,
      pastUsers,
      newUsers,
    });
  } catch (error) {
    return res.status(500).json({
      message: `${error.message}`,
      success: false,
    });
  }
};

module.exports = {
  createConversations,
  getAllConversationsById,
  getConversationById,
  getAllConversations,
  getAllConversationsByUser,
};

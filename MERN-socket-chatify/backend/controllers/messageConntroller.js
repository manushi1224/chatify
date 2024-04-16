const messageModel = require("../models/message");

const createMessages = async (req, res) => {
  try {
    const messages = await messageModel.create(req.body);
    await messages.save();
    return res.status(201).json({
      message: "Message created successfully",
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}`,
      success: false,
    });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await messageModel.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json({
      message: "All messages",
      success: true,
      messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `${error.message}`,
      success: false,
    });
  }
};

module.exports = { createMessages, getAllMessages };

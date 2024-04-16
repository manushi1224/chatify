const { text } = require("express");
const mongoose = require("mongoose");
const mongoValidator = require("mongoose-unique-validator");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

messageSchema.plugin(mongoValidator);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;

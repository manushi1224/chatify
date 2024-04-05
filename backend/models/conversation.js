const mongoose = require("mongoose");
const mongoValidator = require("mongoose-unique-validator");

const conversationSchema = new mongoose.Schema({
  members: {
    type: Array,
  },
  // user: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

conversationSchema.plugin(mongoValidator);

const conversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = conversationModel;

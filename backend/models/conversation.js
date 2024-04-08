const mongoose = require("mongoose");
const mongoValidator = require("mongoose-unique-validator");

const conversationSchema = new mongoose.Schema({
  members: {
    type: Array,
  },
});

conversationSchema.plugin(mongoValidator);

const conversationModel = mongoose.model("Conversation", conversationSchema);

module.exports = conversationModel;

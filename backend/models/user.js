const mongoose = require("mongoose");
const mongoValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  // chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conversation" }],
});

userSchema.plugin(mongoValidator);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

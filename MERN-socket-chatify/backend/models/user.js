const mongoose = require("mongoose");
const mongoValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

userSchema.plugin(mongoValidator);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;

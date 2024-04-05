const mongoose = require("mongoose");
const mongoValidator = require("mongoose-unique-validator");

const notificationSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  recieverId: { type: String, required: true },
  text: { type: String, required: true },
  userName: { type: String, required: true },
  type: { type: String, default: "response" },
  createdAt: { type: Date, default: Date.now },
});

notificationSchema.plugin(mongoValidator);

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;

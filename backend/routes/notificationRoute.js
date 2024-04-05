const express = require("express");
const {
  createNewNotification,
  getNotification,
  deleteNotificationById,
} = require("../controllers/notificationController");
const notificationRoutes = express.Router();

notificationRoutes.get("/:recieverId", getNotification);
notificationRoutes.post("/", createNewNotification);
notificationRoutes.delete("/:notificationId", deleteNotificationById);

module.exports = notificationRoutes;

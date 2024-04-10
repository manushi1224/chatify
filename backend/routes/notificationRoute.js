const express = require("express");
const {
  createNewNotification,
  getNotification,
  deleteNotificationById,
} = require("../controllers/notificationController");
const checkAuth = require("../middleware/check-auth");
const notificationRoutes = express.Router();

notificationRoutes.get("/:recieverId", getNotification);

notificationRoutes.use(checkAuth);

notificationRoutes.post("/", createNewNotification);
notificationRoutes.delete("/:notificationId", deleteNotificationById);

module.exports = notificationRoutes;

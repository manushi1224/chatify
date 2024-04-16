const notificationModel = require("../models/notification");

const createNewNotification = async (req, res) => {
  try {
    const { senderId, recieverId, text, userName, type } = req.body;
    console.log(senderId, recieverId, text, userName, type);
    const newNotification = new notificationModel({
      senderId,
      recieverId,
      text,
      userName,
      type,
    });
    await newNotification.save();
    return res
      .status(200)
      .json({
        message: "Notification created successfully",
        notification: newNotification,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getNotification = async (req, res) => {
  try {
    const notifications = await notificationModel.find({
      recieverId: req.params.recieverId,
    });
    return res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteNotificationById = async (req, res) => {
  const notificationId = req.params.notificationId;
  console.log(notificationId);
  try {
    const notification = await notificationModel.findByIdAndDelete(
      notificationId
    );
    return res
      .status(200)
      .json({ message: "Notification deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNewNotification,
  getNotification,
  deleteNotificationById,
};

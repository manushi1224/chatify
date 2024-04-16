import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const sendNotification = async ({
  senderId,
  recieverId,
  text,
  userName,
  type,
  token,
}) => {
  try {
    return await axios.post(
      `${url}/api/notifications`,
      {
        senderId,
        recieverId,
        text,
        userName,
        type,
      },
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const deleteNotification = async (notificationId, token) => {
  try {
    return await axios.delete(`${url}/api/notifications/${notificationId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllNotifications = async (userId) => {
  try {
    return await axios.get(`${url}/api/notifications/${userId}`);
  } catch (error) {
    console.log(error);
  }
};

export { sendNotification, deleteNotification, getAllNotifications };

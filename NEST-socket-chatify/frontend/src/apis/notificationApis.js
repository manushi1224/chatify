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
      `${url}/notification/createNotification`,
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
    throw error;
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

const getAllNotifications = async (userId, token) => {
  try {
    return await axios.get(`${url}/notification/getNotification/${userId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { sendNotification, deleteNotification, getAllNotifications };

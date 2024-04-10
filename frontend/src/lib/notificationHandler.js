import { sendNotification } from "../apis/notificationApis";

const notificationHandler = async (data, token) => {
  try {
    const response = await sendNotification({
      senderId: data.senderId,
      recieverId: data.recieverId,
      text: "You have a missed call!",
      userName: data.userName,
      type: "notification",
      token: token,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { notificationHandler };

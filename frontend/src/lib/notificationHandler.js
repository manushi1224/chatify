import { sendNotification } from "../apis/notificationApis";

const notificationHandler = async (data) => {
  console.log("notificationHandler", data);
  try {
    const response = await sendNotification({
      senderId: data.senderId,
      recieverId: data.recieverId,
      text: "You have a missed call!",
      userName: data.userName,
      type: "notification",
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export { notificationHandler };

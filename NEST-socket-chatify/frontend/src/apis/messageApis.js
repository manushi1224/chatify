import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const sendNewMessage = async ({
  conversationId,
  senderId,
  recieverId,
  message,
  token,
}) => {
  try {
    return await axios.post(
      `${url}/message/createMessage`,
      {
        senderId,
        recieverId,
        conversationId,
        message,
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

const getAllMessages = async (conversationId, token) => {
  try {
    return await axios.get(`${url}/message/getMessages/${conversationId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export { sendNewMessage, getAllMessages };

import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const sendNewMessage = async ({ conversationId, sender, text }) => {
  try {
    return await axios.post(`${url}/api/messages/`, {
      conversationId,
      sender,
      text,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllMessages = async (conversationId) => {
  try {
    return await axios.get(`${url}/api/messages/${conversationId}`);
  } catch (error) {
    console.log(error);
  }
};

export { sendNewMessage, getAllMessages };

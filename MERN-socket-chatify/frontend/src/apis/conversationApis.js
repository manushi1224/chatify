import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const getConversationById = async (conversationId) => {
  try {
    return await axios.get(
      `${url}/api/conversations/conversation/${conversationId}`
    );
  } catch (error) {
    console.log(error);
  }
};

const getConversationByUserId = async (userId) => {
  try {
    const response = await axios.get(
      `${url}/api/conversations/conversation/user/${userId}`
    );
    console.log("response", response.data.conversationId);
    return response;
  } catch (error) {
    console.log("error", error);
  }
};

const getConversationByUser = async (userId) => {
  try {
    return await axios.get(
      `${url}/api/conversations/conversationByUser/${userId}`
    );
  } catch (error) {}
};

const getAllConversationsByUser = async (userId) => {
  try {
    return await axios.get(
      `${url}/api/conversations/allConversations/${userId}`
    );
  } catch (error) {
    console.log(error);
  }
};

const createNewConversation = async ({ senderId, recieverId, token }) => {
  try {
    return await axios.post(
      `${url}/api/conversations/`,
      {
        senderId,
        recieverId,
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

export {
  getConversationById,
  getConversationByUserId,
  getConversationByUser,
  createNewConversation,
  getAllConversationsByUser,
};

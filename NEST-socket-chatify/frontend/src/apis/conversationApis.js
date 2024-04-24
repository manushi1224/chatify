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

const getConversationByUser = async (userId, token) => {
  try {
    return await axios.get(
      `${url}/conversation/getAllConversationsByUserId/${userId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getAllConversationByMembers = async (userId, token) => {
  try {
    return await axios.get(
      `${url}/conversation/getConversationByMembers/${userId}`,
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
  getConversationByUser,
  createNewConversation,
  getAllConversationByMembers,
};

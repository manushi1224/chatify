import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const getConversationById = async (conversationId, token) => {
  try {
    const res = await axios.get(
      `${url}/conversation/getConversationByConvoId/${conversationId}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    return res;
  } catch (error) {
    throw error;
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
      `${url}/conversation/createConversation`,
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
    throw error;
  }
};

export {
  getConversationById,
  getConversationByUser,
  createNewConversation,
  getAllConversationByMembers,
};

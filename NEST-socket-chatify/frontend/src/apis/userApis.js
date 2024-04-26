import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const getUserById = async (token, userId) => {
  try {
    return await axios.get(`${url}/auth/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${url}/auth/signin`, formData);
    return response;
  } catch (error) {
    throw error;
  }
};

const signupUser = async (formData) => {
  try {
    const response = await axios.post(`${url}/user/signup`, formData);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const editUserProfile = async (userId, formData, userContext) => {
  try {
    const response = await axios.patch(
      `${url}/user/updateProfile/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${userContext.token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export { getUserById, loginUser, signupUser, editUserProfile };

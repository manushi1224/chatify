import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const getUserById = async (token, userId) => {
  try {
    const res = await axios.get(`${url}/auth/profile/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
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
  fetch(`http://localhost:5000/api/user/${userId}`, {
    method: "PATCH",
    body: JSON.stringify(formData),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + userContext.token,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      userContext.getUserData();
    })
    .catch((error) => {
      throw error;
    });
};

export { getUserById, loginUser, signupUser, editUserProfile };

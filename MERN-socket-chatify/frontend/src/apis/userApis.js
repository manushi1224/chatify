import axios from "axios";

let url = process.env.REACT_APP_API_KEY;

const getUserById = async (userId) => {
  try {
    const res = await axios.get(`${url}/api/user/${userId}`);
    return res.data;
  } catch (error) {}
};

const loginUser = async (formData) => {
  try {
    const response = await axios.post(`${url}/api/user/login`, formData);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const signupUser = async (formData) => {
  try {
    const response = await axios.post(`${url}/api/user/signup`, formData);
    return response;
  } catch (error) {
    console.log(error);
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
      return error;
    });
};

export { getUserById, loginUser, signupUser, editUserProfile };

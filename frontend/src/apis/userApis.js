const getUserById = async (userId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_KEY}/api/user/${userId}`
    );
    setReciever(res.data.user);
  } catch (error) {
    console.log(error);
  }
};

const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  const { email, password, userName } = req.body;

  let existingUser;
  try {
    existingUser = await userModel.findOne({ email: email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `${error.message}`, success: false });
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User already exists", success: false });
  }

  const bcryptPass = await bcrypt.hash(password, 12);

  try {
    const newUser = new userModel({
      email,
      password: bcryptPass,
      userName,
    });
    await newUser.save();
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `${error.message}`, success: false });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await userModel.findOne({ email: email });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `${error.message}`, success: false });
  }
  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "Invalid credentials", success: false });
  }

  let isValidPass = false;
  try {
    isValidPass = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `${error.message}`, success: false });
  }
  if (!isValidPass) {
    return res
      .status(400)
      .json({ message: "Invalid credentials", success: false });
  }

  let token;
  try {
    token = jwt.sign(
      {
        email: existingUser.email,
        user_id: existingUser._id,
      },
      "secret is secret",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: `${error.message}`, success: false });
  }

  return res.status(200).json({
    message: "Logged in successfully",
    success: true,
    user: existingUser,
    token: token,
  });
};

const displayUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ users: users });
  } catch (error) {
    return res.status(500).json({ message: `${error.message}` });
  }
};

const displayUsersById = async (req, res) => {
  const uid = req.params.id;
  let users;
  try {
    const user = await userModel.findById(uid);
    return res.status(200).json({ user: user });
  } catch (error) {
    return res.status(500).json({ message: `${error.message}` });
  }
};

module.exports = { displayUsers, loginUser, createUser, displayUsersById };

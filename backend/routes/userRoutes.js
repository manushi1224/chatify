const express = require("express");
const {
  loginUser,
  displayUsers,
  createUser,
  displayUsersById,
} = require("../controllers/userControllers");
const userRoutes = express.Router();

userRoutes.get("/", displayUsers);
userRoutes.get("/:id", displayUsersById);
userRoutes.post("/signup", createUser);
userRoutes.post("/login", loginUser);

module.exports = userRoutes;

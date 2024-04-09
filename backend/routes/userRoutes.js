const express = require("express");
const {
  loginUser,
  displayUsers,
  createUser,
  displayUsersById,
  editUser,
} = require("../controllers/userControllers");
const userRoutes = express.Router();

userRoutes.get("/", displayUsers);
userRoutes.get("/:id", displayUsersById);
userRoutes.post("/signup", createUser);
userRoutes.post("/login", loginUser);
userRoutes.patch("/:id", editUser);

module.exports = userRoutes;

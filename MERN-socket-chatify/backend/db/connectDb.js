const mongoose = require("mongoose");
const dotenv = require("dotenv");

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`MongoDB connected successfully! ${mongoose.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
  }
}

module.exports = { connectDb };

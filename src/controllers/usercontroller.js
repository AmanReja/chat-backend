import express from "express";
import Message from "../models/messageSchema.js";
import User from "../models/userSchema.js";

const router = express.Router();

export const getuserprofile = async (req, res) => {
  try {
    const loginUser = req.user._id;

    const user = await User.find({ _id: { $ne: loginUser } }).select(
      "-userpass"
    );

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getuserprofile:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getoneuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json(user);
  } catch (error) {}
};

export const deleteuser = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await User.findByIdAndDelete(id);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default router;

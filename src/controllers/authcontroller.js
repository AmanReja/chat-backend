import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

import generateToken from "../lib/utils.js";

import User from "../models/userSchema.js";

export const signup = async (req, res) => {
  const { useremail, userpass, userimage, fullname, userimageid } = req.body;
  try {
    if (userpass.length < 6) {
      return res
        .status(400)
        .json({ message: "password length must be graterthan 6 digit" });
    }

    const user = await User.findOne({ useremail });
    if (user) {
      return res.status(400).json({ message: "user already exeist" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedpass = await bcryptjs.hash(userpass, salt);
    const newuser = new User({
      useremail: useremail,
      fullname: fullname,
      userpass: hashedpass,

      userimage: userimage,
      userimageid: userimageid
    });

    if (newuser) {
      generateToken(newuser._id, res);
      await newuser.save();
      res.status(201).json({
        id: newuser._id,
        useremail: newuser.useremail,

        userimage: newuser.userimage
      });
    } else {
      res.status(400).json({ message: "invalid user" });
    }
  } catch (error) {
    console.log("error in controller", error.message);

    res.status(500).json({ message: "internal server error" });
  }
};
export const login = async (req, res) => {
  const { useremail, userpass, userimage, fullname } = req.body;

  try {
    const user = await User.findOne({ useremail });

    if (!user) {
      return res.status(500).json({ message: "invalid credentials" });
    }

    const ispassCorrect = await bcryptjs.compare(userpass, user.userpass);
    if (!ispassCorrect) {
      return res.status(500).json({ message: "invalid credentials" });
    }
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      useremail: user.useremail,
      userimage: user.userimage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json("logout successfull");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkauth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in checkauth", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

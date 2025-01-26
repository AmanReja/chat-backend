import "dotenv/config";

import jwt from "jsonwebtoken";

const generateToken = (userid, res) => {
  const token = jwt.sign({ userid }, process.env.JWT_SECRAT, {
    expiresIn: "7d"
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
  });

  return token;
};

export default generateToken;

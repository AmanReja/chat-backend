import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

export const secureRoutes = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Don't have any token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRAT);

    if (!decoded) {
      return res.status(403).json({ message: "unauthorized Invalid token" });
    }

    const user = await User.findById(decoded.userid).select("-userpass");

    if (!user) {
      return res.status(405).json({ message: " user not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("error in sucure rout middleware", error.message);

    return res.status(500).json({ message: "internalServer error" });
  }
};

export default secureRoutes;

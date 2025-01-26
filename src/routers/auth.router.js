import express from "express";
const router = express.Router();
import secureRoutes from "../middlewares/secureroutes.js";

import {
  signup,
  login,
  logout,
  checkauth
} from "../controllers/authcontroller.js";

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/checkauth", secureRoutes, checkauth);
export default router;

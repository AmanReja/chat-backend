import express from "express";
const router = express.Router();
import {
  sendmessage,
  getmessage,
  deleteAllMessages
} from "../controllers/messagecontroller.js";
import secureRoutes from "../middlewares/secureroutes.js";

router.post("/send/:id", secureRoutes, sendmessage);
router.get("/get/:id", secureRoutes, getmessage);
router.delete("/deleteAll/:id", secureRoutes, deleteAllMessages);

export default router;

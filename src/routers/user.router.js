import express from "express";
const router = express.Router();
import { getuserprofile, getoneuser } from "../controllers/usercontroller.js";
import secureRoutes from "../middlewares/secureroutes.js";
import { deleteuser } from "../controllers/usercontroller.js";

router.get("/getuserprofile", secureRoutes, getuserprofile);
router.get("/getoneuser/:id", getoneuser);
router.delete("/deleteuser/:id", deleteuser);

export default router;

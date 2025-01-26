import express from "express";
import { getMessage, sendMessage, deleteMessage } from "../controller/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();
router.post("/send/:id", secureRoute, sendMessage);
router.get("/get/:id", secureRoute, getMessage);
router.delete("/delete/:id", secureRoute, deleteMessage);

export default router;

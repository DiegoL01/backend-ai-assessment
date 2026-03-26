import { Router } from "express";
import { handleAskController } from "../controllers/ask.controller.js";

const router = Router();

router.post("/", handleAskController);

export default router;
import { Router } from "express";
import * as marketController from "../controllers/market.controller.js";

const router = Router();

router.get("/price", marketController.getPrice);
router.get("/klines", marketController.getKlines);

export default router;
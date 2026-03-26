import { Router } from "express";
import { ollamaController } from "../controllers/ollama.controller.js";

const router = Router();

router.get("/ping", (req, res) => ollamaController.ping(req, res));

router.post("/generate", (req, res) => ollamaController.generate(req, res));

export default router;
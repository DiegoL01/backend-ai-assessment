import { Router } from "express";
import { ollamaController } from "../controllers/ollama.controller.js";

const router = Router();

router.get("/ollama", (req, res) => ollamaController.getInfo(req, res));

router.get("/ollama/ping", (req, res) => ollamaController.ping(req, res));

router.get("/ollama/models", (req, res) => ollamaController.listModels(req, res));

router.post("/ollama/generate", (req, res) => ollamaController.generate(req, res));

router.get("/ollama/health", (req, res) => ollamaController.health(req, res));

export default router;
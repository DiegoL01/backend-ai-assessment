import { ollamaService } from "../services/ollama.service.js";
import { logger } from "../utils/logger.js";

export class OllamaController {
  async getInfo(req, res) {
    try {
      const isModelAvailable = await ollamaService.isModelAvailable();

      res.json({
        service: "Ollama Integration",
        status: "connected",
        model: ollamaService.model,
        baseUrl: ollamaService.baseUrl,
        modelAvailable: isModelAvailable,
        endpoints: {
          generate: "POST /api/ask (uses Ollama)",
          ping: "GET /api/ollama/ping",
          models: "GET /api/ollama/models",
          info: "GET /api/ollama",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error in getInfo", { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async ping(req, res) {
    try {
      const result = await ollamaService.ping();

      res.json({
        success: result.success,
        ollama: result.reachable ? "reachable" : "unreachable",
        model: ollamaService.model,
        url: ollamaService.baseUrl,
        message: result.message,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error in ping", { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message,
        ollama: "error",
      });
    }
  }

  async listModels(req, res) {
    try {
      const result = await ollamaService.listModels();

      if (!result.success) {
        return res.status(502).json({
          success: false,
          error: result.error,
          message: "Failed to fetch models from Ollama",
        });
      }

      res.json({
        success: true,
        models: result.models,
        defaultModel: result.defaultModel,
        count: result.models.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error in listModels", { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async generate(req, res) {
    try {
      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Missing or invalid prompt",
          message: "Prompt is required and must be a non-empty string",
        });
      }

      logger.info("Direct generate request", {
        promptLength: prompt.length,
      });

      const result = await ollamaService.generate(prompt);

      if (!result.success) {
        return res.status(502).json({
          success: false,
          error: result.error,
          message: "Failed to generate response from Ollama",
        });
      }

      res.json({
        success: true,
        response: result.response,
        metadata: result.metadata,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Error in generate endpoint", { error: error.message });
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  async health(req, res) {
    try {
      const pingResult = await ollamaService.ping();
      const modelsResult = await ollamaService.listModels();
      const isModelAvailable = await ollamaService.isModelAvailable();

      res.json({
        success: true,
        status: pingResult.reachable ? "healthy" : "unhealthy",
        services: {
          ollama: {
            reachable: pingResult.reachable,
            message: pingResult.message,
            model: ollamaService.model,
            modelAvailable: isModelAvailable,
          },
        },
        models: modelsResult.success
          ? {
              total: modelsResult.models.length,
              available: modelsResult.models.map((m) => m.name),
            }
          : null,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error("Health check failed", { error: error.message });
      res.status(500).json({
        success: false,
        status: "error",
        error: error.message,
      });
    }
  }
}

export const ollamaController = new OllamaController();

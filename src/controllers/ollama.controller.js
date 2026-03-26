import { ollamaService } from "../services/ollama.service.js";

export class OllamaController {
  

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
      res.status(500).json({
        success: false,
        error: error.message,
        ollama: "error",
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
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  
}

export const ollamaController = new OllamaController();

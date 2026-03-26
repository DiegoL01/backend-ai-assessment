import * as ollamaLib from "../lib/ollama.js";
import { config } from "../lib/config.js";
import { logger } from "../utils/logger.js";

export class OllamaService {
  constructor() {
    this.baseUrl = config.ollamaBaseUrl;
    this.model = config.ollamaModel;
    this.timeoutMs = config.ollamaTimeoutMs;
  }

  async ping() {
    const result = await ollamaLib.ping();
    
    return {
      success: result,
      reachable: result,
      message: result ? "Ollama is reachable" : "Ollama is not reachable"
    };
  }

  /**
   * @param {string} prompt 
   * @param {Object} options 
   */
  async generate(prompt) {
    const result = await ollamaLib.generate(prompt);
    
    if (result.error) {
      return {
        success: false,
        error: result.error
      };
    }
    
    return {
      success: true,
      response: result.response,
      metadata: {
        model: this.model,
        promptLength: prompt?.length || 0,
        responseLength: result.response?.length || 0
      }
    };
  }

  async listModels() {
    try {
      const url = `${this.baseUrl}/api/tags`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}`
        };
      }
      
      return {
        success: true,
        models: data.models || [],
        defaultModel: this.model
      };
    } catch (error) {
      logger.error("Failed to list models", { error: error.message });
      return {
        success: false,
        error: error.message
      };
    }
  }

  async isModelAvailable(modelName = this.model) {
    const result = await this.listModels();
    
    if (!result.success) return false;
    
    return result.models.some(model => model.name === modelName);
  }
}

export const ollamaService = new OllamaService();
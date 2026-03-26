import * as ollamaLib from "../lib/ollama.js";
import { config } from "../lib/config.js";

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

 

  
}

export const ollamaService = new OllamaService();
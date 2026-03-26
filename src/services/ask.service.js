import { marketService } from "./market.service.js";
import * as ollama from "./lib/ollama.js";
import {
  cleanMarketData,
  marketDataToText,
  getQuickRecommendation,
  buildAskPrompt,
  buildSimplePrompt,
} from "../utils/promptBuilder.js";

export class AskService {
  async processQuestion(question) {
    if (!question || typeof question !== "string" || !question.trim()) {
      throw new Error("Question is required");
    }

    const marketDataRaw = await marketService.getMarketContext("BTCUSDT");

    let marketData = null;

    if (marketDataRaw && marketDataRaw.stats) {
      const cleanedData = cleanMarketData(marketDataRaw);
      const textContext = marketDataToText(cleanedData);
      const recommendation = getQuickRecommendation(cleanedData);

      marketData = {
        cleaned: cleanedData,
        text: textContext,
        recommendation: recommendation,
      };
    }

    const prompt = marketData?.text
      ? buildAskPrompt(question, marketData)
      : buildSimplePrompt(question);

    const result = await ollama.generate(prompt);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      answer: result.response,
      metadata: {
        usedMarketData: !!marketData,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

export const askService = new AskService();

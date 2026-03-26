import * as marketService from "./market.service.js";
import * as ollama from "../lib/ollama.js";
import {
  buildAskPrompt,
  buildSimplePrompt,
} from "../utils/promptBuilder.js";
import {
  cleanMarketData,
  marketDataToText,
  getQuickRecommendation,
} from "../utils/marketDataCleaner.js";
export class AskService {
 async processQuestion(question, symbol) {
    if (!question || typeof question !== "string" || !question.trim()) {
      throw new Error("Question is required");
    }

    const marketDataRaw = await marketService.getFullMarketContext(symbol);

    let marketData = null;

  if (marketDataRaw && marketDataRaw.current) {
      const cleanedData = cleanMarketData(marketDataRaw);
      const textContext = marketDataToText(cleanedData);
      const recommendation = getQuickRecommendation(cleanedData);

      marketData = {
        cleaned: cleanedData,
        text: textContext,
        recommendation: recommendation,
      };

      prompt = buildAskPrompt(question, marketData);
    } else {
      prompt = buildSimplePrompt(question);
    }

    const result = await ollama.generate(prompt);

    if (!result.success) {
      throw new Error(result.error);
    }

    return {
      answer: result.response,
      metadata: {
        usedMarketData: !!marketData,
        symbol: symbol || "BTCUSDT",
        timestamp: new Date().toISOString(),
      },
    };
}
}

export const askService = new AskService();

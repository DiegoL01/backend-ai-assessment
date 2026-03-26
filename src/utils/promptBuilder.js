/**
 * @param {string} question 
 * @param {Object} marketData 
 * @returns {string}
 */
export const buildAskPrompt = (question, marketData) => {
  if (!marketData) {
    return `
You are an expert assistant in Bitcoin and cryptocurrencies. Answer the following question clearly, concisely, and helpfully.

Question: ${question}

Instructions:
- Be precise and fact-based
- If you don't know something, say so honestly
- Maintain a professional but friendly tone

Answer:`;
  }

  const cleanedData = marketData.cleaned || marketData;
  const marketContext =
    marketData.text || formatMarketDataForPrompt(cleanedData);
  const recommendation =
    marketData.recommendation || getContextRecommendation(cleanedData);

  return `
You are an expert assistant in Bitcoin and cryptocurrency trading. You have access to real-time market data.

## CURRENT MARKET DATA:
${marketContext}

## QUICK ANALYSIS:
${recommendation}

## USER QUESTION:
${question}

## INSTRUCTIONS:
1. Base your answer on the provided market data
2. If the question requires technical analysis, use specific numbers from the context
3. Be objective and avoid giving unsolicited financial advice
4. If there isn't enough information in the context to answer, state that clearly
5. Keep the answer concise but informative (maximum 3-4 paragraphs)

## ANSWER:`;
};

/**
 * @param {Object} data
 * @returns {string}
 */
const formatMarketDataForPrompt = (data) => {
  return `
- Current Price: $${data.currentPrice?.toLocaleString() || "N/A"} USD
- 24h Change: ${data.priceChange24h || "0"}%
- 24h Range: $${data.low24h?.toLocaleString() || "N/A"} - $${data.high24h?.toLocaleString() || "N/A"} USD
- Trend: ${data.trend || "neutral"}
- Volatility: ${data.volatility || "medium"}
`.trim();
};

/**
 * @param {Object} data
 * @returns {string}
 */
const getContextRecommendation = (data) => {
  const change = parseFloat(data.priceChange24h);

  if (change > 3) return "Strong bullish momentum in the last 24 hours.";
  if (change > 1) return "Moderate bullish trend.";
  if (change < -3) return "Strong bearish pressure.";
  if (change < -1) return "Moderate bearish trend.";
  return "Sideways market, no clear direction.";
};

/**
 * @param {string} question
 * @returns {string}
 */
export const buildSimplePrompt = (question) => {
  return `
You are an expert assistant in Bitcoin and cryptocurrencies.

Question: ${question}

Answer clearly, concisely, and helpfully. If you don't know something, say so honestly.

Answer:`;
};

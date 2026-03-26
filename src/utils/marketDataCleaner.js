/**
 * @param {Object} marketData
 * @returns {Object}
 */
export const cleanMarketData = (marketData) => {
  if (!marketData) return null;

  const cleanedData = {
    symbol: marketData.metadata?.symbol || "BTCUSDT",
    currency: marketData.metadata?.currency || "USD",
    timestamp: marketData.metadata?.timestamp || new Date().toISOString(),

    currentPrice: marketData.stats?.currentPrice || 0,
    priceChange24h: marketData.stats?.change24h || "0",
    high24h: marketData.stats?.high24h || 0,
    low24h: marketData.stats?.low24h || 0,

    trend: marketData.indicator?.trend || "neutral",
    volatility: marketData.indicator?.volatility || "medium",

    priceRange:
      marketData.stats?.high24h && marketData.stats?.low24h
        ? (
            ((marketData.stats.high24h - marketData.stats.low24h) /
              marketData.stats.low24h) *
            100
          ).toFixed(2)
        : "0",
    isBullish: marketData.indicator?.trend === "bullish",
  };

  return cleanedData;
};

/**
 * @param {Object} cleanedData
 * @returns {string}
 */
export const marketDataToText = (cleanedData) => {
  if (!cleanedData) return "No hay datos de mercado disponibles.";

  const changeSymbol = parseFloat(cleanedData.priceChange24h) >= 0 ? "+" : "";
  const trendText =
    cleanedData.trend === "bullish"
      ? "BULLISH"
      : cleanedData.trend === "bearish"
        ? "BEARISH"
        : "NEUTRAL";
  const volatilityText =
    cleanedData.volatility === "high"
      ? "HIGH"
      : cleanedData.volatility === "low"
        ? "LOW"
        : "MEDIUM";

  return `
BITCOIN MARKET UPDATE

Current Price: $${cleanedData.currentPrice.toLocaleString()} ${cleanedData.currency}
24h Change: ${changeSymbol}${cleanedData.priceChange24h}%
24h Range: $${cleanedData.low24h.toLocaleString()} - $${cleanedData.high24h.toLocaleString()}
Price Range Width: ${cleanedData.priceRange}%

Market Indicators:
- Trend: ${trendText}
- Volatility: ${volatilityText}

Data as of: ${new Date(cleanedData.timestamp).toLocaleString()}
`.trim();
};

/**
 * @param {Object} cleanedData
 * @returns {string}
 */
export const getQuickRecommendation = (cleanedData) => {
  if (!cleanedData) return "Sin datos suficientes para recomendación.";

  const changePercent = parseFloat(cleanedData.priceChange24h);
  const trend = cleanedData.trend;

  if (trend === "bullish" && changePercent > 2) {
    return "Mercado alcista fuerte - Considera mantener posiciones o tomar ganancias parciales.";
  } else if (trend === "bullish") {
    return "Mercado alcista moderado - Momento positivo, monitorea resistencia.";
  } else if (trend === "bearish" && changePercent < -2) {
    return "Mercado bajista fuerte - Considera reducir exposicion o esperar.";
  } else if (trend === "bearish") {
    return "Mercado bajista moderado - Paciencia, esperar señal de reversión.";
  } else {
    return "Mercado lateral - Esperar confirmación de dirección.";
  }
};

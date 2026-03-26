/**
 * @param {Object} marketData
 * @returns {Object}
 */
/**
 * @param {Object} marketData
 */
export const cleanMarketData = (marketData) => {
  if (!marketData) return null;

  const { symbol, current, extremes } = marketData;

  const cleanedData = {
    symbol: symbol || "BTCUSDT",
    currency: "USD",
    timestamp: new Date().toISOString(),

    currentPrice: parseFloat(current?.price || 0),
    priceChange24h: current?.change24h || "0%", 
    high24h: parseFloat(extremes?.high24h || 0),
    low24h: parseFloat(extremes?.low24h || 0),

    trend: (current?.sentiment || "neutral").toLowerCase(),
    
    priceRange: (extremes?.high24h && extremes?.low24h)
        ? (((parseFloat(extremes.high24h) - parseFloat(extremes.low24h)) / parseFloat(extremes.low24h)) * 100).toFixed(2)
        : "0",
    
    isBullish: current?.sentiment === "BULLISH",
  };

  return cleanedData;
};

export const marketDataToText = (cleanedData) => {
  if (!cleanedData) return "No hay datos de mercado disponibles.";

  return `
MARKET CONTEXT: ${cleanedData.symbol}
-----------------------------------
- Price: $${cleanedData.currentPrice.toLocaleString()}
- 24h Change: ${cleanedData.priceChange24h}
- Day Range: $${cleanedData.low24h.toLocaleString()} to $${cleanedData.high24h.toLocaleString()}
- Volatility Range: ${cleanedData.priceRange}%
- Current Trend: ${cleanedData.trend.toUpperCase()}

The market sentiment is currently ${cleanedData.trend}.
`.trim();
};
 
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

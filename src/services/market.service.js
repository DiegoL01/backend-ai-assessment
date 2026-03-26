import * as marketLib from "../lib/market.js";
import { config } from "../lib/config.js";

export const getBtcPrice = async (symbol) => {
  const targetSymbol = symbol || config.defaultSymbol;
  const result = await marketLib.getPrice(targetSymbol);

  if (result.error) {
    throw new Error(`Error al obtener precio de Binance: ${result.error}`);
  }

  // Aquí podrías añadir lógica extra, como redondear el precio
  return {
    symbol: result.symbol,
    price: parseFloat(result.price).toFixed(2),
    updatedAt: new Date().toISOString()
  };
};

export const getHistory = async (symbol, interval, limit) => {
  const result = await marketLib.getKlines(
    symbol || config.defaultSymbol,
    interval || "1h",
    limit || 24
  );

  if (result.error) {
    throw new Error(`Error al obtener historial: ${result.error}`);
  }
  
  return result;
};

// * Método para limpiar los Klines (Velas)
//  * Convierte los arrays crudos en objetos que un humano (y una IA) entienden.
//  */
const formatKlines = (klinesArray) => {
  return klinesArray.map(k => ({
    time: new Date(k[0]).toLocaleString(),
    open: parseFloat(k[1]),
    high: parseFloat(k[2]),
    low: parseFloat(k[3]),
    close: parseFloat(k[4]),
    volume: parseFloat(k[5])
  }));
};


export const getFullMarketContext = async (symbol = 'BTCUSDT') => {
  // Ejecutamos ambos en paralelo para que sea súper rápido
  const [priceData, klinesData] = await Promise.all([
    marketLib.getPrice(symbol),
    marketLib.getKlines(symbol, '1h', 24) // Últimas 24 horas
  ]);

  if (priceData.error || klinesData.error) {
    throw new Error("Falló la recolección de datos de Binance");
  }

  const currentPrice = parseFloat(priceData.price);
  const cleanHistory = formatKlines(klinesData.klines);
  
  // OBTENEMOS EL "PROVECHO": Datos procesados para la IA
  const firstPrice = cleanHistory[0].open; // Precio hace 24h
  const priceChange = ((currentPrice - firstPrice) / firstPrice) * 100;
  const high24h = Math.max(...cleanHistory.map(k => k.high));
  const low24h = Math.min(...cleanHistory.map(k => k.low));

  // Este es el objeto final que le entregas a tu compañero
  return {
    symbol: priceData.symbol,
    current: {
      price: currentPrice.toFixed(2),
      change24h: `${priceChange.toFixed(2)}%`,
      sentiment: priceChange > 0 ? "BULLISH" : "BEARISH"
    },
    extremes: {
      high24h: high24h.toFixed(2),
      low24h: low24h.toFixed(2)
    },
    recentHistory: cleanHistory.slice(-5) // Le damos solo las últimas 5 velas para no saturar la IA de tokens
  };
};
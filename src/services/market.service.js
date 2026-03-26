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
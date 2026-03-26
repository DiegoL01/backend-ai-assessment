import * as marketService from "../services/market.service.js";

export const getPrice = async (req, res) => {
  try {
    const data = await marketService.getBtcPrice(req.query.symbol);
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
};

export const getKlines = async (req, res) => {
  try {
    const { symbol, interval, limit } = req.query;
    const data = await marketService.getHistory(symbol, interval, parseInt(limit));
    res.json(data);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
};


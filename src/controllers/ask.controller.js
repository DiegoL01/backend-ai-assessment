import { askService } from "../services/ask.service.js";

export const handleAsk = async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    
    const result = await askService.processQuestion(question);
    
    res.json({
      success: true,
      answer: result.answer,
      metadata: result.metadata
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
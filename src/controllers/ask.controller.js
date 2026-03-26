import { askService } from "../services/ask.service.js";


export const handleAskController = async (req, res) => {
  try {
    const { question , symbol } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    
    const result = await askService.processQuestion(question , symbol);
    
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
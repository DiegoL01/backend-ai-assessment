import { Router } from "express";

const router = Router();
router.get("/ollama",(req , res )=>{
   res.json({
    mensaje :"Hola desde Ollama"
   })
    console.log("routes de LLM")
})

export default router;
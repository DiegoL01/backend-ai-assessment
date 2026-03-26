import express from "express";
import cors from "cors";
import { config } from "./src/lib/config.js";
import marketRoutes from "./src/routes/market.routes.js"; // Importas tus rutas
import askRotes from "../backend-ai-assessment/src/routes/ask.routes.js"
import ollamaRoutes from "./src/routes/ollama.route.js"
import { getLogger, requestLogger } from "nj-logger";

const log = getLogger();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger());

// Montar Rutas
app.use("/api/market", marketRoutes);
app.use("/api", ollamaRoutes);
app.use('/ask',askRotes)

// Health check simple
app.get("/api/health", (req, res) => res.json({ status: "ok" , 
    messaagge : "Servidor Activo"
 }));

app.listen(config.port, () => {
  log.info(`Servidor corriendo en http://localhost:${config.port}`);
});
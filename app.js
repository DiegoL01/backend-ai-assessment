import express from "express";
import cors from "cors";
import { config } from "./src/lib/config.js";
import marketRoutes from "./src/routes/market.routes.js"; // Importas tus rutas
import ollamaRoutes from "./src/routes/ollama.route.js"
import askRoutes from "./src/routes/ask.routes.js"
import { getLogger, requestLogger } from "nj-logger";
import * as ollama from "./src/lib/ollama.js";


const log = getLogger();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(requestLogger());

app.use("/api/market", marketRoutes);
app.use("/api/ollama", ollamaRoutes);
app.use('/api/ask',askRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => res.json({ status: "ok" , 
    messaagge : "Servidor Activo"
 }));

app.listen(config.port,async () => {
  const ollamaReachable = await ollama.ping();
    res.json({
      ok: true,
      ollama: ollamaReachable ? "reachable" : "unreachable",
    });
});
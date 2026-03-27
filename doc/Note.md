# Backend AI Assessment - Crypto Assistant

##  Overview
This project is a professional backend service that integrates real-time market data from **Binance** with Large Language Models (LLM) via **Ollama**. It uses a **RAG (Retrieval-Augmented Generation)** architecture to provide accurate, data-driven answers about the cryptocurrency market.

---

##  Architecture & Design Decisions

### 1. Layered Architecture
The project follows a strict separation of concerns to ensure maintainability and scalability:
- **Providers/Lib (`src/lib/`):** Low-level integration with external APIs (Binance and Ollama).
- **Services (`src/services/`):** Orchestration of business logic. The `AskService` acts as the brain, fetching market data and merging it with AI prompts.
- **Controllers (`src/controllers/`):** Handles HTTP lifecycle, input validation, and standardized JSON responses.
- **Utils (`src/utils/`):** Dedicated logic for data cleaning (`marketDataCleaner.js`) and prompt engineering (`promptBuilder.js`).

### 2. The RAG Flow (Retrieval-Augmented Generation)
Instead of relying solely on the LLM's static training data, the application:
1. **Retrieves** real-time price and 24h Klines (candlesticks) from Binance.
2. **Processes** raw arrays into human-readable metrics (Trend, Volatility, Price Range).
3. **Augments** the user's question with this context using a specialized system prompt.
4. **Generates** a grounded response through Ollama.

### 3. Containerization (Docker)
The application is fully containerized using **Docker** and **Docker Compose**. This ensures:
- **Environment Consistency:** "It works on my machine" is no longer an issue.
- **Isolated Dependencies:** Node.js and Ollama run in their own, clean environments.
- **Easy Deployment:** The entire stack can be launched with a single command.

---

##  Market Data Integration
- **Source:** Binance Public API.
- **Data Points:** Current Price, 24h High/Low, Percentage Change, and recent hourly history.
- **Indicators:** The system calculates a "Sentiment" (Bullish/Bearish) based on 24h price action to guide the AI's tone.

---

##  Logging Strategy
- **Library:** `nj-logger`.
- **Implementation:** No `console.log` statements are used in production code.
- **Structure:** All requests are tracked with their method, path, and status code. Error logs include the stack trace for faster debugging.

---

## Future Scalability (Roadmap)
If I were to extend this project for a production environment:
1. **Caching (Redis):** Implement a 1-minute cache for market data to avoid hitting Binance rate limits and speed up repeated queries.
2. **Streaming:** Use Server-Sent Events (SSE) to stream Ollama's response word-by-word for a better UX.
3. **Persistent History:** Integrate a database (MongoDB/PostgreSQL) to maintain conversation threads.

---

##  Setup & Installation

### Option A: Standard (Local Node.js)
1. `npm install`
2. Configure `.env` with `PORT` and `OLLAMA_URL`.
3. Ensure Ollama is running locally with the desired model.
4. `npm start`

### Option B: Recommended (Docker Compose)
This is the preferred method for easy testing. The entire backend stack (Node.js + Ollama) will be built and launched automatically.

1. Ensure you have Docker and Docker Compose installed.
2. Run the following command from the root directory:
   ```bash
   docker-compose up --build
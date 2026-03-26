# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

# Create directory for logs
RUN mkdir -p /app/logs

# Expose application port
EXPOSE 3002

# Start command with wait for Ollama and launch the app
CMD ["sh", "-c", "echo 'Waiting for Ollama...' && sleep 5 && npm start"]
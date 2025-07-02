# Stage 1: Frontend Builder
# This stage builds the static frontend assets.
FROM node:18.18.0-slim AS frontend-builder
WORKDIR /app
COPY frontend/ .
RUN npm install
RUN npm run build
# Stage 2: Final Production Image
# This stage prepares the backend and assembles the final image.
FROM node:18.18.0-slim
WORKDIR /app
# Copy the backend source code into a 'backend' subdirectory.
COPY backend/ ./backend/
# Set the working directory to the backend folder.
WORKDIR /app/backend
# Install backend production dependencies.
RUN npm install --omit=dev
# Copy the pre-built frontend assets from the builder stage into the correct final location.
COPY --from=frontend-builder /app/dist ./frontend/dist
# --- FINAL DIAGNOSTIC STEP ---
# List all files recursively in the final image right before starting the server.
# Expose the port.
EXPOSE 8081
# The command to start the server. Node will look for server.js in the current WORKDIR.
CMD ["node", "server.js"]

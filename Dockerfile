# Stage 1: Frontend Builder
# This stage builds the static frontend assets.
FROM node:18.18.0-slim AS frontend-builder
WORKDIR /app

# --- FINAL FIX ---
# 1. Declare a build-time argument with the same name as the Railway variable.
ARG VITE_SHOPIFY_API_KEY
# 2. Set it as an environment variable that the 'npm run build' process can access.
ENV VITE_SHOPIFY_API_KEY=$VITE_SHOPIFY_API_KEY
# --- END FIX ---

COPY frontend/ .
RUN npm install
RUN npm run build

# Stage 2: Backend Builder
# Prepares the backend code and production dependencies.
FROM node:18.18.0-slim AS backend-builder
WORKDIR /app
COPY backend/ .
RUN npm install --omit=dev

# Stage 3: Final Production Image
# Assembles the final, clean image.
FROM node:18.18.0-slim
WORKDIR /app

# Copy the prepared backend (source + node_modules) from the backend-builder stage.
COPY --from=backend-builder /app/ .
# Copy the built frontend assets from the frontend-builder stage.
COPY --from=frontend-builder /app/dist ./frontend/dist

EXPOSE 8081
# The final command to run the server.
CMD ["node", "server.js"]

# Stage 1: Backend Dependencies
# This stage installs only the backend dependencies and will be cached
# unless backend/package*.json changes.
FROM node:18.18.0-slim AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev

# Stage 2: Frontend Dependencies
# This stage installs only the frontend dependencies and will be cached
# unless frontend/package*.json changes.
FROM node:18.18.0-slim AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

# Stage 3: Frontend Builder
# This stage builds the frontend assets. It uses the cached frontend dependencies.
FROM node:18.18.0-slim AS frontend-builder
WORKDIR /app/frontend
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY frontend/ .
RUN npm run build

# Stage 4: Final Production Image
# This is the final, small image that will run the app.
FROM node:18.18.0-slim
WORKDIR /app

# Copy backend source code (without node_modules)
COPY backend/ .
# Copy cached backend dependencies
COPY --from=backend-deps /app/backend/node_modules ./node_modules

# Copy the built frontend from the builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 8081
CMD ["node", "server.js"]

# Force commit by adding a new comment at the top
# Stage 1: Frontend Builder
# This stage builds the static frontend assets.
FROM node:18.18.0-slim AS frontend-builder

# Set the working directory for the entire frontend stage.
WORKDIR /app

# Declare the build-time argument that Railway will provide.
ARG VITE_SHOPIFY_API_KEY

# Copy package files first to leverage Docker's cache.
# This means npm install will only run if these files change.
COPY frontend/package*.json ./

# Install all frontend dependencies.
RUN npm install

# Now copy the rest of the frontend source code.
COPY frontend/ .

# Run the build command. We pass the API key as an environment variable
# directly to this command to ensure it's available.
# The build output will be created in /app/dist.
RUN VITE_SHOPIFY_API_KEY=$VITE_SHOPIFY_API_KEY npm run build

# Debug: Покажи съдържанието на /app/dist в Railway logs
RUN ls -l /app/dist

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
# The source is /app/dist and the destination is ./frontend/dist, which is correct
# for our Express server to find the files.
COPY --from=frontend-builder /app/dist ./frontend/dist

EXPOSE 8081

# The final command to run the server.
CMD ["node", "server.js"]

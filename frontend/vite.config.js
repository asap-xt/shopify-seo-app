import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // You can define a specific port for the dev server
    // Configure a proxy to redirect API requests to the backend server.
    // This avoids CORS issues during local development.
    proxy: {
      // Any request starting with /api will be forwarded to the backend
      '/api': {
        target: 'http://localhost:8081', // Your backend server URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Define build output directory to match Dockerfile config
  build: {
    outDir: 'dist'
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow external access (needed for Docker)
    proxy: {
      // Any request starting with /api will be forwarded to the backend
      '/api': {
        target: 'http://backend:8081', // Use service name in Docker
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Define build output directory to match our Dockerfile config
  build: {
    outDir: 'dist'
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // This section is for the development server and is not used by Railway,
  // but it's good practice to have it correctly configured.
  // The syntax error was likely a missing comma or brace here.
  server: {
    port: 3000, // You can define a specific port for the dev server
    proxy: {
      // Any request starting with /api will be forwarded to the backend
      '/api': {
        target: 'http://localhost:8081', // Your backend server URL
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

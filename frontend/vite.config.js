import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Determine if running in Docker
const isDocker = process.env.VITE_API_URL && process.env.VITE_API_URL.includes('localhost');

export default defineConfig({
  plugins: [react()],
  server: {
    host: isDocker ? '0.0.0.0' : '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Determine if running in Docker
const isDocker = process.env.VITE_API_URL && process.env.VITE_API_URL.includes('localhost');

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: ['varlik-yonetimi.medicalisg.com', 'localhost', '127.0.0.1', '.medicalisg.com'],
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true,
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://karma-studios.onrender.com',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist'
  }
})

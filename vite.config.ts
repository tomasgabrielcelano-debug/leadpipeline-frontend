import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy to avoid CORS when backend runs on http://localhost:5081
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5081',
      '/webhook': 'http://localhost:5081',
      '/swagger': 'http://localhost:5081',
      '/hangfire': 'http://localhost:5081'
    }
  }
})

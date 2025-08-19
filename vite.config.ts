import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pokemon-guide/', // GitHub Pages repository name
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

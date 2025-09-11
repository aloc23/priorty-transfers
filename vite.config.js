import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/priority-transfers-admin/',
  build: {
    outDir: 'docs'
  }
})

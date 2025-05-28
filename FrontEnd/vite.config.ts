import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // Remover configuraciones externas problemáticas
    },
    chunkSizeWarningLimit: 1600,
    outDir: 'dist',
    sourcemap: false
  },
  assetsInclude: ['**/*.svg'],
  define: {
    global: 'globalThis',
  }
})
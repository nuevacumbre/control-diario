import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // IMPORTANTE: Debe coincidir exactamente con el nombre del repositorio
  base: '/control-diario/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'pinia', 'vue-router'],
          ui: ['chart.js', 'lucide-vue-next', 'date-fns']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
})
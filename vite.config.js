import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    base: env.VITE_BASE_URL || '/', // Importante para GitHub Pages
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
            ui: ['lucide-vue-next', 'date-fns', 'chart.js']
          }
        }
      }
    },
    server: {
      port: 3000,
      host: true
    }
  }
})
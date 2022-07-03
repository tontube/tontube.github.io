import { fileURLToPath, URL } from 'url'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      plugins: [inject({ Buffer: ['Buffer', 'Buffer'] })],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
})

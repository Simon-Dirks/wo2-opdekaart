import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api/locations.php': {
        target: 'https://wo2kaart.hualab.nl/api/locations.php',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

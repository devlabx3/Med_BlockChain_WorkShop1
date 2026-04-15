import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy /rpc → https://testnet.monad.xyz/
      // Solves CORS: browser calls localhost, Vite server forwards to RPC
      '/rpc': {
        target: 'https://testnet.monad.xyz',
        changeOrigin: true,
        rewrite: () => '/',  // always forward to root /
      },
    },
  },
})

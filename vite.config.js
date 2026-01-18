import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  console.log('Building with ENV:', {
    VITE_BACKEND_URL: env.VITE_BACKEND_URL,
    VITE_ENVIRONMENT: env.VITE_ENVIRONMENT
  })
  
  return {
    plugins: [
      vue(),
      tailwindcss(),
      legacy({
        targets: ['iOS >= 12'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL),
      'import.meta.env.VITE_ENVIRONMENT': JSON.stringify(env.VITE_ENVIRONMENT),
    },
    build: {
      target: ['es2018'],
    },
    server: {
      allowedHosts: true,
    },
  }
})
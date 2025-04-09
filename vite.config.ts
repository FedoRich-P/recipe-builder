import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
})

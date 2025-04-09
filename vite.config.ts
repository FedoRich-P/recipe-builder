import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
})


// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react-swc';
// import tsconfigPaths from 'vite-tsconfig-paths';
//
// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     tsconfigPaths()],
// });

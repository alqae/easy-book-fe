import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import { resolve } from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint({ cache: false })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      '@/lib': resolve(__dirname, './src/lib'),
      '@/components': resolve(__dirname, './src/components'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/types': resolve(__dirname, './src/types'),
    },
  },
})

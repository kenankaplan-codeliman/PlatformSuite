import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
    dedupe: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'react-hook-form',
      'zod',
      'antd',
    ],
  },
  optimizeDeps: {
    exclude: ['@platform/ui'],
  },
  server: {
    port: 5180,
    proxy: {
      '/api': { target: 'http://localhost:5000', changeOrigin: true },
      '/auth': { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
});

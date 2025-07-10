import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Works without importing 'path' or using __dirname
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Use @ as an alias for /src
    },
  },
  build: {
    outDir: 'dist', // Vercel will use this as the output directory
    sourcemap: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});




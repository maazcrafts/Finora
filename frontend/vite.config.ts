import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // GitHub Pages serves project sites from /<repository-name>/.
  // Set PAGES_BASE_PATH=/Finora/ in the Pages workflow; local dev stays at /.
  base: process.env.PAGES_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': projectDir,
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});

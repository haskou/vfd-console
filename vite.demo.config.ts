import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    emptyOutDir: true,
    outDir: '../demo-dist',
  },
  root: 'demo',
});

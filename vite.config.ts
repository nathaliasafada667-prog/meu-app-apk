
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Garante que a API_KEY da Vercel esteja disponível no código cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false
  },
  server: {
    fs: {
      strict: false
    }
  }
});

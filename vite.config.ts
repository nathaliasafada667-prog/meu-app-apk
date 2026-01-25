
import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    // Injeta a chave de API do ambiente de build (Vercel) para o código cliente
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    fs: {
      strict: false
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'ES2020',
    outDir: 'build',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'radix-ui': ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
          'vendor': ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});

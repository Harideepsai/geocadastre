import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    publicDir: path.resolve(__dirname, 'frontend/public'),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@frontend': path.resolve(__dirname, 'frontend'),
        '@backend': path.resolve(__dirname, 'backend'),
        '@database': path.resolve(__dirname, 'database'),
        '@app': path.resolve(__dirname, 'frontend/app'),
        '@components': path.resolve(__dirname, 'frontend/components'),
        '@lib': path.resolve(__dirname, 'frontend/lib'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

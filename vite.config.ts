import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            // Ensure service worker and manifest are not hashed
            entryFileNames: 'assets/[name].[hash].js',
            chunkFileNames: 'assets/[name].[hash].js',
            assetFileNames: (assetInfo) => {
              const name = assetInfo.name || '';
              if (name === 'sw.js' || name === 'manifest.json' || name === 'register-sw.js' || name.endsWith('favicon.svg')) {
                return '[name][extname]';
              }
              return 'assets/[name].[hash][extname]';
            }
          }
        }
      },
      // Copy service worker and manifest to root
      publicDir: 'public'
    };
});

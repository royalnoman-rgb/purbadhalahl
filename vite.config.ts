import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import Sitemap from 'vite-plugin-sitemap';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      Sitemap({
        hostname: 'https://purbadhalahl.vercel.app',
        dynamicRoutes: [
          '/category/important_links',
          '/category/emergency',
          '/category/healthcare',
          '/category/blood_donors',
          '/category/administration',
          '/category/education',
          '/category/business',
          '/category/transport',
          '/category/specialists',
          '/category/media',
          '/community',
          '/map'
        ]
      })
    ],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/messaging'],
            icons: ['lucide-react']
          }
        }
      }
    }
  };
});

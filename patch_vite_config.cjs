const fs = require('fs');

let config = fs.readFileSync('vite.config.ts', 'utf8');

const targetImport = `import {defineConfig} from 'vite';`;
const replImport = `import {defineConfig} from 'vite';\nimport Sitemap from 'vite-plugin-sitemap';`;

const targetPlugins = `plugins: [react(), tailwindcss()],`;
const replPlugins = `plugins: [
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
    ],`;

if (config.includes(targetImport)) {
  config = config.replace(targetImport, replImport);
}
if (config.includes(targetPlugins)) {
  config = config.replace(targetPlugins, replPlugins);
}

fs.writeFileSync('vite.config.ts', config);
console.log('Successfully patched vite.config.ts');

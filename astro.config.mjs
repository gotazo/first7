import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap'; // ✅ ADD THIS

export default defineConfig({
  output: 'static',
  site: 'https://first7.org',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    mdx(),
    sitemap() // ✅ ADD THIS
  ]
});
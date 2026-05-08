import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://first7.org',

  output: 'server',

  adapter: cloudflare({
    imageService: 'compile',
    platformProxy: {
      enabled: false
    }
  }),

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    mdx(),
    sitemap()
  ]
});
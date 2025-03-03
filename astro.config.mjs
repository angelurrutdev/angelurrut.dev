import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import svelte from '@astrojs/svelte';



export default defineConfig({
  // ...
  integrations: [tailwind(), svelte()],
  output:'server',
  adapter: vercel(),
});
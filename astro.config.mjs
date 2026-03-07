import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';

// Read the installed Astro version at build time so the page can
// display it without a network call at runtime.
const { version: astroVersion } = JSON.parse(
  readFileSync('./node_modules/astro/package.json', 'utf-8')
);

export default defineConfig({
  vite: {
    define: {
      // Injected as compile-time constants — available in .astro
      // frontmatter and client components as plain identifiers.
      __ASTRO_VERSION__: JSON.stringify(astroVersion),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
  },
});

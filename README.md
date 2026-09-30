# Astro Hello World Recipe App

<!-- #ZEROPS_EXTRACT_START:intro# -->
A minimal [Astro](https://astro.build) application demonstrating static site generation on [Zerops](https://zerops.io) — built with Node.js at build time, served by Nginx at runtime, with build-time environment variable injection via the `PUBLIC_*` convention.
Used within [Astro Hello World recipe](https://app.zerops.io/recipes/astro-hello-world) for [Zerops](https://zerops.io) platform.
<!-- #ZEROPS_EXTRACT_END:intro# -->

⬇️ **Full recipe page and deploy with one-click**

[![Deploy on Zerops](https://github.com/zeropsio/recipe-shared-assets/blob/main/deploy-button/light/deploy-button.svg)](https://app.zerops.io/recipes/astro-hello-world?environment=small-production)

![astro cover](https://github.com/zeropsio/recipe-shared-assets/blob/main/covers/svg/cover-astro.svg)

## Integration Guide

<!-- #ZEROPS_EXTRACT_START:integration-guide# -->

### 1. Adding `zerops.yaml`

The main application configuration file you place at the root of your repository. It tells Zerops how to build, deploy, and run your application.

```yaml
# The 'prod' setup builds optimized static assets for Nginx serving.
# The 'dev' setup deploys full source code for live development.
zerops:
  - setup: prod
    build:
      # Build with Node.js (npm/npx), serve with Nginx.
      # The build container compiles Astro source into static HTML/
      # CSS/JS — Node.js is NOT present at runtime.
      base: nodejs@24
      buildCommands:
        - npm ci
        # PUBLIC_APP_ENV is baked into the static output at build
        # time — there is no runtime process to read env vars later.
        # RUNTIME_APP_ENV is the 'APP_ENV' service env var, injected
        # by Zerops with a RUNTIME_ prefix into the build shell so
        # each environment gets its own label in the compiled output.
        - PUBLIC_APP_ENV=${RUNTIME_APP_ENV:-production} npm run build
      # Strip the 'dist/' prefix — contents become the Nginx root,
      # so dist/index.html is served as /index.html.
      deployFiles:
        - dist/~
      cache:
        - node_modules

    run:
      # Nginx serves the compiled output — no Node.js at runtime.
      base: static
      # Zerops Static includes built-in SPA fallback: unmatched
      # routes serve /index.html, supporting client-side routing
      # without custom run.routing configuration.

  - setup: dev
    build:
      base: nodejs@24
      os: ubuntu
      # npm install (not ci) — dev environment may lack a lock file
      # or a developer may have added packages without committing.
      buildCommands:
        - npm install
      # Deploy full source + node_modules so the developer can SSH
      # in and start the Astro dev server immediately.
      deployFiles: ./
      cache:
        - node_modules

    run:
      # Node.js runtime so the developer has npm and the Astro CLI
      # available via SSH. The dev setup does NOT use 'static' here.
      base: nodejs@24
      os: ubuntu
      # Keep the container alive without starting a server.
      # Developer SSHs in and runs 'npm run dev' to start Astro's
      # dev server with HMR on the port of their choice.
      start: zsc noop --silent
```

### 2. Build-time environment variables

Astro uses the `PUBLIC_*` prefix to expose variables to the build. In Zerops, set `APP_ENV` as a service environment variable — it becomes `RUNTIME_APP_ENV` in the build shell:

```astro
---
const appEnv = import.meta.env.PUBLIC_APP_ENV ?? 'development';
---
```

This is the fundamental pattern for static deployments: all configuration must be injected **at build time**, because there is no runtime process to read environment variables after the build.

<!-- #ZEROPS_EXTRACT_END:integration-guide# -->

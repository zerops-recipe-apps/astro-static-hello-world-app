# astro-static-hello-world-app

Astro 5 static-output starter — static build served by nginx in prod; dev container runs the Astro dev server over SSH.

## Zerops service facts

- HTTP port: dev `4321` (Astro default) / prod `80` (nginx)
- Siblings: —
- Runtime base: dev `nodejs@24` / prod `static`

## Zerops dev

`setup: dev` idles on `zsc noop --silent`; the agent starts the dev server.

- Dev command: `npm run dev`
- In-container rebuild without deploy: `npm run build`

**All platform operations (start/stop/status/logs of the dev server, deploy, env / scaling / storage / domains) go through the Zerops development workflow via `zcp` MCP tools. Don't shell out to `zcli`.**

## Notes

- Static deployments have no runtime process — `PUBLIC_*` env vars must be baked at build time via `PUBLIC_APP_ENV=${RUNTIME_APP_ENV:-production} npm run build` (Zerops exposes service runtime vars to the build shell with a `RUNTIME_` prefix).
- `deployFiles: dist/~` strips the `dist/` prefix so `index.html` lands at the nginx document root.
- `astro.config.mjs` reads `node_modules/astro/package.json` at build time to embed the Astro version as `__ASTRO_VERSION__`.

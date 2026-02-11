# ip-man-web

Frontend app built with Vue 3 + Vite.

## Prerequisites

1. Install **Node.js latest LTS** (recommended via `nvm`).
2. Install **pnpm** (this project uses pnpm, not npm/yarn).
   - Install guide: https://pnpm.io/installation

```sh
# check versions
node -v
pnpm -v
```

## Run the App (Step by Step)

1. Clone and open the project directory.
2. Install dependencies:

```sh
pnpm install
```

3. Start the development server:

```sh
pnpm dev
```

4. Open the local URL shown in the terminal (usually `http://localhost:5173`).

## Other Useful Commands

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint

```sh
pnpm lint
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize Configuration

See [Vite Configuration Reference](https://vite.dev/config/).

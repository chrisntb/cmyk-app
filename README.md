# CMYK Web Application

> Felix Felicis - VS Code workspace [cmyk-app.code-workspace](cmyk-app.code-workspace)

> [CMYK](https://github.com/chrisntb/cmyk) - Engineering and architecture documentation

Single Page App (SPA) implemented using [Svelte](https://svelte.dev/), [SvelteKit](https://svelte.dev/docs/kit/introduction) and TypeScript.
[Tailwind](https://tailwindcss.com/) is used for CSS.
[shadcn-svelte](https://shadcn-svelte.com/) is used for UI components.

Dev toolchain is:

- [Bun](https://bun.com/)
- [Vite](https://vite.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Biome](https://biomejs.dev/)

## Documentation

See [docs/README.md](docs/README.md).

## Prerequisites

See [docs/Tools.md](docs/Tools.md) for the required tools.

You will need access to the service APIs which can run as a local mock, see [cmyk-svc](https://github.com/chrisntb/cmyk-svc).

## Tasks

To work with dependencies:

```shell
bun outdated

bun install
```

To start a development server:

```shell
bun run dev
```

To build as a SPA:

```shell
bun run build
```

To host the SPA:

```shell
bun run preview
# OR
npm install -g browser-sync
browser-sync build/
```

### Static Analysis

Quality:

```shell
# Types & other Svelte quality checks
bun run sk

# Style only
bun run format
# Auto fix -> bun run format_

# Issues only
bun run lint
# Auto fix -> bun run lint_

# Style, issues, import sorting and more linting rules e.g. it also includes 'useArrowFunction' checks
bun run check
# Auto fix -> bun run check_
```

Tests:

```shell
bun run test
bun run coverage
```

### Change Theme

See `https://shadcncolors.com/` for colors.

```shell
bun x shadcn-svelte@latest init
```

### Add UI Component

See `https://shadcn-svelte.com/docs/components/button`.

```shell
bun x shadcn-svelte@latest add button
```

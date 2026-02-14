# Context

- Svelte/SvelteKit single page app (SPA)
- Implemented using TypeScript
- All rendering is on the client
- Do not use serverside rendering (SSR)
- CSS is implemented using Tailwind `https://tailwindcss.com/`
- UI components are implemented using the Svelte port of shadcn `https://shadcn-svelte.com/`

Default to using Bun instead of Node.js.

## Tasks

- Build
  - `bun run build`
- Static analysis
  - Types & other Svelte quality checks
    - `bun run sk`
  - Style only
    - `bun run format`
  - Issues only
    - `bun run lint`
  - Style, issues, import sorting and more linting rules e.g. it also includes 'useArrowFunction' checks
    - `bun run check`
- Test
  - `bun run test`
- Add shadcn UI component e.g. `button`
  - `bun x shadcn-svelte@latest add button`

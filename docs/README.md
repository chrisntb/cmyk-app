# Documentation

See [CMYK](https://github.com/chrisntb/cmyk) for engineering and architecture documentation.

- [Tips](Tips.md)
- [Tools](Tools.md)

## Notes

Documentation automatically created for the original skeleton code: [README_Wizard](README_Wizard.md).

### Original Project Initialization

For reference ONLY.
This project was originally created using these instructions.

Install tools, see [Tools.md](Tools.md).

Create project:

```shell
npx sv create cmyk-app
# ┌  Welcome to the Svelte CLI! (v0.11.4)
# │
# ◇  Which template would you like?
# │  SvelteKit minimal
# │
# ◇  Add type checking with TypeScript?
# │  Yes, using TypeScript syntax
# │
# ◇  What would you like to add to your project? (use arrow keys / space bar)
# │  vitest, tailwindcss
# │
# ◇  tailwindcss: Which plugins would you like to add?
# │  forms
# │
# ◇  vitest: What do you want to use vitest for?
# │  unit testing
# │
# ◆  Project created
# │
# ◆  Successfully setup add-ons: tailwindcss, vitest
# │
# ◇  Which package manager do you want to install dependencies with?
# │  bun
# │
# │  To skip prompts next time, run:
# ●  bun x sv create --template minimal --types ts --add tailwindcss="plugins:forms" vitest="usages:unit" --install bun cmyk-app
# ...
# │
# └  You're all set!

bun x shadcn-svelte@latest init
```

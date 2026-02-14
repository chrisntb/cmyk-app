# Tools

This component requires the tools documented here.

## Node

Install Node via `nvm`:

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Restart your shell
exec bash -l
# OR
exec zsh -l

nvm install --lts
```

## Bun

Bun is mainly used for package managment so we can ignore dependencies as update candidates if they are too recent.

```shell
curl -fsSL https://bun.com/install | bash
```

## VS Code Config

Recommended VS Code settings are available when using the workpace `cmyk-app.code-workspace`.

### Extensions

> Check extension specific documentation since there are often post-install instructions.

- Claude Code for VS Code
  - `https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code`

Node/JavaScript/Typescript:

- [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
  - If you get the following error formatting files add this to your VS Code settings `"biome.lspBin": "./node_modules/@biomejs/biome/bin/biome"`
    - `Extension 'Biome' is configured as formatter but it cannot format 'JavaScript|JSON|TypeScript|TypeScript JSX'-Files`
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

Documentation:

- Markdownlint
  - `https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint`
- Markdown Preview Mermaid Support
  - `https://marketplace.visualstudio.com/items?itemName=bierner.markdown-mermaid`
- Mermaid Markdown Syntax Highlighting
  - `https://marketplace.visualstudio.com/items?itemName=bpruitt-goddard.mermaid-markdown-syntax-highlighting`

### Settings

Recommended additional `user settings`:

```json
{
	//...
	"claudeCode.preferredLocation": "panel",
	//...
	"telemetry.telemetryLevel": "off",
	//...
	"window.nativeTabs": true,
	"window.openFoldersInNewWindow": "on"
	//...
}
```

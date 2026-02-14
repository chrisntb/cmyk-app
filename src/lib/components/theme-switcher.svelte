<script lang="ts">
import Monitor from "@lucide/svelte/icons/monitor";
import Moon from "@lucide/svelte/icons/moon";
import Sun from "@lucide/svelte/icons/sun";
import { browser } from "$app/environment";
import { Button } from "$lib/components/ui/button/index.js";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

type Theme = "light" | "dark" | "system";

let theme = $state<Theme>("system");

function getSystemTheme(): "light" | "dark" {
	if (browser && window.matchMedia("(prefers-color-scheme: light)").matches) {
		return "light";
	}
	return "dark";
}

function applyTheme(newTheme: Theme) {
	if (!browser) return;

	const root = document.documentElement;
	const effectiveTheme = newTheme === "system" ? getSystemTheme() : newTheme;

	root.classList.remove("light", "dark");
	root.classList.add(effectiveTheme);
	localStorage.setItem("theme", newTheme);
}

function setTheme(newTheme: Theme) {
	theme = newTheme;
	applyTheme(newTheme);
}

$effect(() => {
	if (browser) {
		const saved = localStorage.getItem("theme") as Theme | null;
		theme = saved ?? "system";
		applyTheme(theme);

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			if (theme === "system") {
				applyTheme("system");
			}
		};
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}
});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon">
				{#if theme === 'system'}
					<Monitor class="size-5" />
				{:else if theme === 'dark'}
					<Moon class="size-5" />
				{:else}
					<Sun class="size-5" />
				{/if}
				<span class="sr-only">Toggle theme</span>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setTheme('light')}>
			<Sun class="mr-2 size-4" />
			<span>Light</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setTheme('dark')}>
			<Moon class="mr-2 size-4" />
			<span>Dark</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => setTheme('system')}>
			<Monitor class="mr-2 size-4" />
			<span>System</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

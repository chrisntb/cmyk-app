<script lang="ts">
import "./layout.css";
import favicon from "$lib/assets/favicon.svg";
import AppSidebar from "$lib/components/app-sidebar.svelte";
import MockDataToggle from "$lib/components/mock-data-toggle.svelte";
import ThemeSwitcher from "$lib/components/theme-switcher.svelte";
import * as Sidebar from "$lib/components/ui/sidebar/index.js";
import { isMockMode } from "$lib/mock-mode.svelte";

const { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Sidebar.SidebarProvider>
	<AppSidebar />
	<Sidebar.SidebarInset>
		<header class="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
			<Sidebar.SidebarTrigger class="-ml-1" />
			<div class="ml-auto flex items-center gap-4">
				<MockDataToggle />
				<ThemeSwitcher />
			</div>
		</header>
		<main class="flex-1 p-6">
			{#key isMockMode()}
				{@render children()}
			{/key}
		</main>
	</Sidebar.SidebarInset>
</Sidebar.SidebarProvider>

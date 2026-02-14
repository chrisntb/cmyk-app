<script lang="ts">
import Database from "@lucide/svelte/icons/database";
import { page } from "$app/state";
import { Switch } from "$lib/components/ui/switch/index.js";
import * as Tooltip from "$lib/components/ui/tooltip/index.js";
import { isMockMode, setMockMode } from "$lib/mock-mode.svelte";

const slurmPage = $derived(page.url.pathname.startsWith("/slurm"));

$effect(() => {
	if (slurmPage && !isMockMode()) {
		setMockMode(true);
	}
});

function handleToggle(checked: boolean) {
	setMockMode(checked);
}
</script>

<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<div class="flex items-center gap-2">
				<Database class="size-4 text-muted-foreground" />
				<span class="text-xs text-muted-foreground">Mock</span>
				<Switch checked={isMockMode()} onCheckedChange={handleToggle} disabled={slurmPage} />
			</div>
		</Tooltip.Trigger>
		{#if slurmPage}
			<Tooltip.Portal>
				<Tooltip.Content>
					Slurm supports mock mode only
				</Tooltip.Content>
			</Tooltip.Portal>
		{/if}
	</Tooltip.Root>
</Tooltip.Provider>

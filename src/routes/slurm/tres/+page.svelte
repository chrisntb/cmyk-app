<script lang="ts">
import Cpu from "@lucide/svelte/icons/cpu";
import { fetchSlurmTres } from "$lib/api-slurm";
import * as Table from "$lib/components/ui/table/index.js";

interface TRES {
	type: string;
	name: string;
	id: number;
	count: number;
}

let tres = $state<TRES[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmTres()
		.then((data) => (tres = data))
		.catch(
			(e) => (error = e instanceof Error ? e.message : "Failed to fetch TRES"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Cpu class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Trackable Resources</h1>
	</div>
	<p class="text-muted-foreground">TRES (Trackable RESources) defined in the cluster.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading TRES...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-right">ID</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head class="text-right">Count</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each tres as t (t.id)}
						<Table.Row>
							<Table.Cell class="text-right font-mono">{t.id}</Table.Cell>
							<Table.Cell class="font-medium">{t.type}</Table.Cell>
							<Table.Cell>{t.name || '—'}</Table.Cell>
							<Table.Cell class="text-right font-mono">{t.count.toLocaleString()}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

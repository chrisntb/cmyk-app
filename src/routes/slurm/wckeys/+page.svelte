<script lang="ts">
import Key from "@lucide/svelte/icons/key";
import { fetchSlurmWckeys } from "$lib/api-slurm";
import * as Table from "$lib/components/ui/table/index.js";

interface WCKey {
	id: number;
	name: string;
	user: string;
	cluster: string;
}

let wckeys = $state<WCKey[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmWckeys()
		.then((data) => (wckeys = data))
		.catch(
			(e) =>
				(error = e instanceof Error ? e.message : "Failed to fetch WCKeys"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Key class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">WCKeys</h1>
	</div>
	<p class="text-muted-foreground">Workload Characterization Keys for tracking resource usage.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading WCKeys...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-right">ID</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>User</Table.Head>
						<Table.Head>Cluster</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each wckeys as wk (wk.id)}
						<Table.Row>
							<Table.Cell class="text-right font-mono">{wk.id}</Table.Cell>
							<Table.Cell class="font-medium">{wk.name}</Table.Cell>
							<Table.Cell>{wk.user}</Table.Cell>
							<Table.Cell class="font-mono">{wk.cluster}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

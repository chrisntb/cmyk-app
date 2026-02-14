<script lang="ts">
import Layers from "@lucide/svelte/icons/layers";
import { fetchSlurmClusters } from "$lib/api-slurm";
import * as Table from "$lib/components/ui/table/index.js";

interface Cluster {
	name: string;
	control_host: string;
	control_port: number;
	nodes: string;
	rpc_version: number;
	tres: string;
}

let clusters = $state<Cluster[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmClusters()
		.then((data) => (clusters = data))
		.catch(
			(e) =>
				(error = e instanceof Error ? e.message : "Failed to fetch clusters"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Layers class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Clusters</h1>
	</div>
	<p class="text-muted-foreground">Registered Slurm clusters.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading clusters...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Control Host</Table.Head>
						<Table.Head class="text-right">Port</Table.Head>
						<Table.Head>Nodes</Table.Head>
						<Table.Head class="text-right">RPC Version</Table.Head>
						<Table.Head>TRES</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each clusters as cluster (cluster.name)}
						<Table.Row>
							<Table.Cell class="font-medium">{cluster.name}</Table.Cell>
							<Table.Cell class="font-mono">{cluster.control_host}</Table.Cell>
							<Table.Cell class="text-right">{cluster.control_port}</Table.Cell>
							<Table.Cell class="font-mono text-sm">{cluster.nodes}</Table.Cell>
							<Table.Cell class="text-right">{cluster.rpc_version}</Table.Cell>
							<Table.Cell class="font-mono text-sm">{cluster.tres}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

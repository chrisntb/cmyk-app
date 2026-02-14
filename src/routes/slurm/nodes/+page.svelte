<script lang="ts">
import Monitor from "@lucide/svelte/icons/monitor";
import { fetchSlurmNodes } from "$lib/api-slurm";
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Table from "$lib/components/ui/table/index.js";

interface SlurmNode {
	name: string;
	state: string;
	cpus: number;
	alloc_cpus: number;
	real_memory: number;
	alloc_memory: number;
	partitions: string[];
	architecture: string;
}

let nodes = $state<SlurmNode[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

const stateVariant = (state: string) => {
	switch (state) {
		case "IDLE":
			return "secondary" as const;
		case "ALLOCATED":
			return "default" as const;
		case "MIXED":
			return "outline" as const;
		case "DOWN":
			return "destructive" as const;
		default:
			return "secondary" as const;
	}
};

const formatMem = (mb: number) => `${(mb / 1000).toFixed(0)} GB`;

$effect(() => {
	fetchSlurmNodes()
		.then((data) => (nodes = data))
		.catch(
			(e) => (error = e instanceof Error ? e.message : "Failed to fetch nodes"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Monitor class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Nodes</h1>
	</div>
	<p class="text-muted-foreground">Cluster node inventory and status.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading nodes...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>State</Table.Head>
						<Table.Head class="text-right">CPUs</Table.Head>
						<Table.Head class="text-right">Alloc CPUs</Table.Head>
						<Table.Head class="text-right">Memory</Table.Head>
						<Table.Head class="text-right">Alloc Mem</Table.Head>
						<Table.Head>Partitions</Table.Head>
						<Table.Head>Arch</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each nodes as node (node.name)}
						<Table.Row>
							<Table.Cell class="font-mono font-medium">{node.name}</Table.Cell>
							<Table.Cell><Badge variant={stateVariant(node.state)}>{node.state}</Badge></Table.Cell
							>
							<Table.Cell class="text-right">{node.cpus}</Table.Cell>
							<Table.Cell class="text-right">{node.alloc_cpus}</Table.Cell>
							<Table.Cell class="text-right">{formatMem(node.real_memory)}</Table.Cell>
							<Table.Cell class="text-right">{formatMem(node.alloc_memory)}</Table.Cell>
							<Table.Cell>{node.partitions.join(', ')}</Table.Cell>
							<Table.Cell class="font-mono">{node.architecture}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

<script lang="ts">
import LayoutGrid from "@lucide/svelte/icons/layout-grid";
import { fetchSlurmPartitions } from "$lib/api-slurm";
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Table from "$lib/components/ui/table/index.js";

interface Partition {
	name: string;
	state: string;
	total_nodes: number;
	total_cpus: number;
	max_time: string;
	default_time: string;
	allow_groups: string;
	nodes: string;
}

let partitions = $state<Partition[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmPartitions()
		.then((data) => (partitions = data))
		.catch(
			(e) =>
				(error = e instanceof Error ? e.message : "Failed to fetch partitions"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<LayoutGrid class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Partitions</h1>
	</div>
	<p class="text-muted-foreground">Queue partitions and their configuration.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading partitions...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>State</Table.Head>
						<Table.Head class="text-right">Nodes</Table.Head>
						<Table.Head class="text-right">CPUs</Table.Head>
						<Table.Head>Max Time</Table.Head>
						<Table.Head>Default Time</Table.Head>
						<Table.Head>Allowed Groups</Table.Head>
						<Table.Head>Node List</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each partitions as partition (partition.name)}
						<Table.Row>
							<Table.Cell class="font-medium">{partition.name}</Table.Cell>
							<Table.Cell
								><Badge variant={partition.state === 'UP' ? 'default' : 'destructive'}
									>{partition.state}</Badge
								></Table.Cell
							>
							<Table.Cell class="text-right">{partition.total_nodes}</Table.Cell>
							<Table.Cell class="text-right">{partition.total_cpus}</Table.Cell>
							<Table.Cell class="font-mono">{partition.max_time}</Table.Cell>
							<Table.Cell class="font-mono">{partition.default_time}</Table.Cell>
							<Table.Cell>{partition.allow_groups}</Table.Cell>
							<Table.Cell class="font-mono">{partition.nodes}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

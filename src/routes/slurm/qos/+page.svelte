<script lang="ts">
import Gauge from "@lucide/svelte/icons/gauge";
import { fetchSlurmQos } from "$lib/api-slurm";
import * as Table from "$lib/components/ui/table/index.js";

interface QOS {
	name: string;
	description: string;
	priority: number;
	max_jobs_per_user: number;
	max_tres_per_user: string;
	max_wall_clock: string;
	preempt_mode: string;
}

let qos = $state<QOS[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmQos()
		.then((data) => (qos = data))
		.catch(
			(e) => (error = e instanceof Error ? e.message : "Failed to fetch QOS"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Gauge class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Quality of Service</h1>
	</div>
	<p class="text-muted-foreground">QOS levels controlling job scheduling priority and limits.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading QOS...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Description</Table.Head>
						<Table.Head class="text-right">Priority</Table.Head>
						<Table.Head class="text-right">Max Jobs/User</Table.Head>
						<Table.Head>Max TRES/User</Table.Head>
						<Table.Head>Max Wall Clock</Table.Head>
						<Table.Head>Preempt Mode</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each qos as q (q.name)}
						<Table.Row>
							<Table.Cell class="font-medium">{q.name}</Table.Cell>
							<Table.Cell>{q.description}</Table.Cell>
							<Table.Cell class="text-right">{q.priority}</Table.Cell>
							<Table.Cell class="text-right">{q.max_jobs_per_user}</Table.Cell>
							<Table.Cell class="font-mono">{q.max_tres_per_user}</Table.Cell>
							<Table.Cell class="font-mono">{q.max_wall_clock}</Table.Cell>
							<Table.Cell>{q.preempt_mode}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

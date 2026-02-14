<script lang="ts">
import Briefcase from "@lucide/svelte/icons/briefcase";
import { fetchSlurmJobs } from "$lib/api-slurm";
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Table from "$lib/components/ui/table/index.js";

interface Job {
	job_id: number;
	name: string;
	user_name: string;
	partition: string;
	job_state: string;
	node_count: number;
	cpus: number;
	time_limit: string;
}

let jobs = $state<Job[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

const stateVariant = (state: string) => {
	switch (state) {
		case "RUNNING":
			return "default" as const;
		case "PENDING":
			return "secondary" as const;
		case "COMPLETED":
			return "outline" as const;
		case "FAILED":
			return "destructive" as const;
		default:
			return "secondary" as const;
	}
};

$effect(() => {
	fetchSlurmJobs()
		.then((data) => (jobs = data))
		.catch(
			(e) => (error = e instanceof Error ? e.message : "Failed to fetch jobs"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Briefcase class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Jobs</h1>
	</div>
	<p class="text-muted-foreground">Active and recent job submissions.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading jobs...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Job ID</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>User</Table.Head>
						<Table.Head>Partition</Table.Head>
						<Table.Head>State</Table.Head>
						<Table.Head class="text-right">Nodes</Table.Head>
						<Table.Head class="text-right">CPUs</Table.Head>
						<Table.Head>Time Limit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each jobs as job (job.job_id)}
						<Table.Row>
							<Table.Cell class="font-mono">{job.job_id}</Table.Cell>
							<Table.Cell class="font-medium">{job.name}</Table.Cell>
							<Table.Cell>{job.user_name}</Table.Cell>
							<Table.Cell>{job.partition}</Table.Cell>
							<Table.Cell
								><Badge variant={stateVariant(job.job_state)}>{job.job_state}</Badge></Table.Cell
							>
							<Table.Cell class="text-right">{job.node_count}</Table.Cell>
							<Table.Cell class="text-right">{job.cpus}</Table.Cell>
							<Table.Cell class="font-mono">{job.time_limit}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

<script lang="ts">
import CalendarClock from "@lucide/svelte/icons/calendar-clock";
import { fetchSlurmReservations } from "$lib/api-slurm";
import { Badge } from "$lib/components/ui/badge/index.js";
import * as Table from "$lib/components/ui/table/index.js";

interface Reservation {
	name: string;
	users: string;
	accounts: string;
	partition: string;
	node_count: number;
	start_time: string;
	end_time: string;
	state: string;
}

let reservations = $state<Reservation[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmReservations()
		.then((data) => (reservations = data))
		.catch(
			(e) =>
				(error =
					e instanceof Error ? e.message : "Failed to fetch reservations"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<CalendarClock class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Reservations</h1>
	</div>
	<p class="text-muted-foreground">Scheduled resource reservations.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading reservations...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>State</Table.Head>
						<Table.Head>Users</Table.Head>
						<Table.Head>Accounts</Table.Head>
						<Table.Head>Partition</Table.Head>
						<Table.Head class="text-right">Nodes</Table.Head>
						<Table.Head>Start</Table.Head>
						<Table.Head>End</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each reservations as res (res.name)}
						<Table.Row>
							<Table.Cell class="font-medium">{res.name}</Table.Cell>
							<Table.Cell
								><Badge variant={res.state === 'ACTIVE' ? 'default' : 'secondary'}
									>{res.state}</Badge
								></Table.Cell
							>
							<Table.Cell>{res.users || '—'}</Table.Cell>
							<Table.Cell>{res.accounts || '—'}</Table.Cell>
							<Table.Cell>{res.partition || '—'}</Table.Cell>
							<Table.Cell class="text-right">{res.node_count}</Table.Cell>
							<Table.Cell class="font-mono text-sm">{res.start_time}</Table.Cell>
							<Table.Cell class="font-mono text-sm">{res.end_time}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

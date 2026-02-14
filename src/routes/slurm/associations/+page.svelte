<script lang="ts">
import Link from "@lucide/svelte/icons/link";
import { fetchSlurmAssociations } from "$lib/api-slurm";
import * as Table from "$lib/components/ui/table/index.js";

interface Association {
	id: number;
	account: string;
	user: string;
	cluster: string;
	partition: string;
	qos: string[];
	default_qos: string;
}

let associations = $state<Association[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

$effect(() => {
	fetchSlurmAssociations()
		.then((data) => (associations = data))
		.catch(
			(e) =>
				(error =
					e instanceof Error ? e.message : "Failed to fetch associations"),
		)
		.finally(() => (loading = false));
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Link class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Associations</h1>
	</div>
	<p class="text-muted-foreground">
		User-account-cluster associations controlling access and limits.
	</p>

	{#if loading}
		<div class="text-muted-foreground">Loading associations...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head class="text-right">ID</Table.Head>
						<Table.Head>User</Table.Head>
						<Table.Head>Account</Table.Head>
						<Table.Head>Cluster</Table.Head>
						<Table.Head>Partition</Table.Head>
						<Table.Head>QOS</Table.Head>
						<Table.Head>Default QOS</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each associations as assoc (assoc.id)}
						<Table.Row>
							<Table.Cell class="text-right font-mono">{assoc.id}</Table.Cell>
							<Table.Cell class="font-medium">{assoc.user}</Table.Cell>
							<Table.Cell>{assoc.account}</Table.Cell>
							<Table.Cell class="font-mono">{assoc.cluster}</Table.Cell>
							<Table.Cell>{assoc.partition || '—'}</Table.Cell>
							<Table.Cell>{assoc.qos.join(', ')}</Table.Cell>
							<Table.Cell class="font-mono">{assoc.default_qos}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

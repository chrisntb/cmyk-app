<script lang="ts">
import List from "@lucide/svelte/icons/list";
import { resolve } from "$app/paths";
import { fetchK8sLocalQueues } from "$lib/api-k8s";
import * as Table from "$lib/components/ui/table/index.js";

interface LocalQueue {
	name: string;
	namespace: string;
	clusterQueue: string;
	stopPolicy: string;
	pendingWorkloads: number;
	reservingWorkloads: number;
	admittedWorkloads: number;
}

let queues = $state<LocalQueue[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

async function fetchQueues() {
	try {
		queues = await fetchK8sLocalQueues();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch local queues";
	} finally {
		loading = false;
	}
}

$effect(() => {
	fetchQueues();
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<List class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Local Queues</h1>
	</div>
	<p class="text-muted-foreground">Local queues and their workload status.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading local queues...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Namespace</Table.Head>
						<Table.Head>Cluster Queue</Table.Head>
						<Table.Head>Stop Policy</Table.Head>
						<Table.Head class="text-right">Pending</Table.Head>
						<Table.Head class="text-right">Reserving</Table.Head>
						<Table.Head class="text-right">Admitted</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each queues as queue (queue.name + queue.namespace)}
						<Table.Row>
							<Table.Cell class="font-medium">
								<a
									href={resolve(`/k8s/local-queues/${queue.namespace}/${queue.name}`)}
									class="text-primary hover:underline"
								>
									{queue.name}
								</a>
							</Table.Cell>
							<Table.Cell>
								<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
									{queue.namespace}
								</span>
							</Table.Cell>
							<Table.Cell class="font-mono text-sm">{queue.clusterQueue}</Table.Cell>
							<Table.Cell>
								{#if queue.stopPolicy === 'None'}
									<span class="text-muted-foreground">None</span>
								{:else}
									<span
										class="rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400"
									>
										{queue.stopPolicy}
									</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right">
								{#if queue.pendingWorkloads > 0}
									<span class="font-medium text-yellow-600 dark:text-yellow-400"
										>{queue.pendingWorkloads}</span
									>
								{:else}
									<span class="text-muted-foreground">0</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right">
								{#if queue.reservingWorkloads > 0}
									<span class="font-medium text-blue-600 dark:text-blue-400"
										>{queue.reservingWorkloads}</span
									>
								{:else}
									<span class="text-muted-foreground">0</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right">
								{#if queue.admittedWorkloads > 0}
									<span class="font-medium text-green-600 dark:text-green-400"
										>{queue.admittedWorkloads}</span
									>
								{:else}
									<span class="text-muted-foreground">0</span>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

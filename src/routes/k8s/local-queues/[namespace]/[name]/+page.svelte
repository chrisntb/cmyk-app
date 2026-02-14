<script lang="ts">
import Activity from "@lucide/svelte/icons/activity";
import ArrowLeft from "@lucide/svelte/icons/arrow-left";
import Info from "@lucide/svelte/icons/info";
import List from "@lucide/svelte/icons/list";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { fetchK8sLocalQueueDetails } from "$lib/api-k8s";

interface LocalQueue {
	name: string;
	namespace: string;
	clusterQueue: string;
	stopPolicy: string;
	pendingWorkloads: number;
	reservingWorkloads: number;
	admittedWorkloads: number;
}

let queue = $state<LocalQueue | null>(null);
let loading = $state(true);
let error = $state<string | null>(null);

async function fetchQueue(namespace: string, name: string) {
	try {
		queue = await fetchK8sLocalQueueDetails(namespace, name);
	} catch (e) {
		error =
			e instanceof Error ? e.message : "Failed to fetch local queue details";
	} finally {
		loading = false;
	}
}

$effect(() => {
	const { namespace, name } = page.params;
	if (namespace && name) {
		fetchQueue(namespace, name);
	}
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-4">
		<a
			href={resolve('/k8s/local-queues')}
			class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="size-4" />
			Back to Local Queues
		</a>
	</div>

	{#if loading}
		<div class="text-muted-foreground">Loading local queue details...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else if queue}
		<div class="flex items-center gap-3">
			<List class="size-8 text-primary" />
			<h1 class="text-3xl font-bold tracking-tight">{queue.name}</h1>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Basic Information -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Info class="size-5 text-muted-foreground" />
					Basic Information
				</h2>
				<dl class="space-y-3">
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Name</dt>
						<dd class="font-medium">{queue.name}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Namespace</dt>
						<dd>
							<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
								{queue.namespace}
							</span>
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Cluster Queue</dt>
						<dd class="font-mono text-sm">{queue.clusterQueue}</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Stop Policy</dt>
						<dd>
							{#if queue.stopPolicy === 'None'}
								<span class="text-muted-foreground">None</span>
							{:else}
								<span
									class="rounded-md bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-600 dark:text-orange-400"
								>
									{queue.stopPolicy}
								</span>
							{/if}
						</dd>
					</div>
				</dl>
			</div>

			<!-- Workloads -->
			<div class="rounded-lg border bg-card p-6">
				<h2 class="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Activity class="size-5 text-muted-foreground" />
					Workloads
				</h2>
				<dl class="space-y-3">
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Pending</dt>
						<dd>
							{#if queue.pendingWorkloads > 0}
								<span class="font-medium text-yellow-600 dark:text-yellow-400"
									>{queue.pendingWorkloads}</span
								>
							{:else}
								<span class="text-muted-foreground">0</span>
							{/if}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Reserving</dt>
						<dd>
							{#if queue.reservingWorkloads > 0}
								<span class="font-medium text-blue-600 dark:text-blue-400"
									>{queue.reservingWorkloads}</span
								>
							{:else}
								<span class="text-muted-foreground">0</span>
							{/if}
						</dd>
					</div>
					<div class="flex justify-between">
						<dt class="text-muted-foreground">Admitted</dt>
						<dd>
							{#if queue.admittedWorkloads > 0}
								<span class="font-medium text-green-600 dark:text-green-400"
									>{queue.admittedWorkloads}</span
								>
							{:else}
								<span class="text-muted-foreground">0</span>
							{/if}
						</dd>
					</div>
				</dl>
			</div>
		</div>
	{:else}
		<div class="text-muted-foreground">Local queue not found.</div>
	{/if}
</div>

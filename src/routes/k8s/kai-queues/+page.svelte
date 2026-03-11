<script lang="ts">
import GitBranch from "@lucide/svelte/icons/git-branch";
import RefreshCw from "@lucide/svelte/icons/refresh-cw";
import { resolve } from "$app/paths";
import { fetchKaiSchedulerQueues } from "$lib/api-k8s";
import { Button } from "$lib/components/ui/button/index.js";
import * as Table from "$lib/components/ui/table/index.js";
import type { KaiSchedulerQueue } from "../../../model/k8s";

let queues = $state<KaiSchedulerQueue[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);
let refreshing = $state(false);

function formatResource(val: number | undefined): string {
	if (val === undefined) return "-";
	return val === -1 ? "∞" : String(val);
}

async function fetchData() {
	try {
		queues = await fetchKaiSchedulerQueues();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch KAI queues";
	} finally {
		loading = false;
		refreshing = false;
	}
}

async function refresh() {
	refreshing = true;
	error = null;
	await fetchData();
}

$effect(() => {
	fetchData();
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<GitBranch class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">KAI Queues</h1>
		<Button variant="outline" size="sm" onclick={refresh} disabled={refreshing} class="ml-auto">
			<RefreshCw class="size-4 {refreshing ? 'animate-spin' : ''}" />
			Refresh
		</Button>
	</div>
	<p class="text-muted-foreground">KAI scheduler queues and their resource configurations.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading KAI queues...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Child Queues</Table.Head>
						<Table.Head class="text-right">CPU Quota</Table.Head>
						<Table.Head class="text-right">CPU Limit</Table.Head>
						<Table.Head class="text-right">GPU Quota</Table.Head>
						<Table.Head class="text-right">GPU Limit</Table.Head>
						<Table.Head class="text-right">Mem Quota</Table.Head>
						<Table.Head class="text-right">Mem Limit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each queues as queue (queue.name)}
						<Table.Row>
							<Table.Cell class="font-medium font-mono">
								{#if queue.child_queues?.length}
									<a
										href={resolve(`/k8s/kai-queues/${queue.name}`)}
										class="text-primary hover:underline"
									>
										{queue.name}
									</a>
								{:else}
									{queue.name}
								{/if}
							</Table.Cell>
							<Table.Cell>
								{#if queue.child_queues?.length}
									<span class="text-muted-foreground text-sm">{queue.child_queues.length}</span>
								{:else}
									<span class="text-muted-foreground">-</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="text-right font-mono text-sm">{formatResource(queue.resources.cpu?.quota)}</Table.Cell>
							<Table.Cell class="text-right font-mono text-sm">{formatResource(queue.resources.cpu?.limit)}</Table.Cell>
							<Table.Cell class="text-right font-mono text-sm">{formatResource(queue.resources.gpu?.quota)}</Table.Cell>
							<Table.Cell class="text-right font-mono text-sm">{formatResource(queue.resources.gpu?.limit)}</Table.Cell>
							<Table.Cell class="text-right font-mono text-sm">{formatResource(queue.resources.memory?.quota)}</Table.Cell>
							<Table.Cell class="text-right font-mono text-sm">{formatResource(queue.resources.memory?.limit)}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

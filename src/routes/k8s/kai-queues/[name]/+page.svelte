<script lang="ts">
import ArrowLeft from "@lucide/svelte/icons/arrow-left";
import GitBranch from "@lucide/svelte/icons/git-branch";
import { resolve } from "$app/paths";
import { page } from "$app/state";
import { fetchKaiSchedulerChildQueues } from "$lib/api-k8s";
import * as Table from "$lib/components/ui/table/index.js";
import type { KaiSchedulerChildQueue } from "../../../../model/k8s";

let childQueues = $state<KaiSchedulerChildQueue[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

function formatResource(val: number | undefined): string {
	if (val === undefined) return "-";
	return val === -1 ? "∞" : String(val);
}

async function fetchData(parentName: string) {
	try {
		const all = await fetchKaiSchedulerChildQueues(parentName);
		childQueues = all.filter((q) => q.parent === parentName);
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch child queues";
	} finally {
		loading = false;
	}
}

$effect(() => {
	const { name } = page.params;
	if (name) fetchData(name);
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-4">
		<a
			href={resolve('/k8s/kai-queues')}
			class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="size-4" />
			Back to KAI Queues
		</a>
	</div>

	<div class="flex items-center gap-3">
		<GitBranch class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">{page.params.name}</h1>
	</div>
	<p class="text-muted-foreground">Child queues of this parent queue.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading child queues...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>Parent</Table.Head>
						<Table.Head class="text-right">CPU Quota</Table.Head>
						<Table.Head class="text-right">CPU Limit</Table.Head>
						<Table.Head class="text-right">GPU Quota</Table.Head>
						<Table.Head class="text-right">GPU Limit</Table.Head>
						<Table.Head class="text-right">Mem Quota</Table.Head>
						<Table.Head class="text-right">Mem Limit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#if childQueues.length === 0}
						<Table.Row>
							<Table.Cell colspan={8} class="text-muted-foreground text-center py-6">
								No child queues found.
							</Table.Cell>
						</Table.Row>
					{:else}
						{#each childQueues as queue (queue.name)}
							<Table.Row>
								<Table.Cell class="font-medium font-mono">{queue.name}</Table.Cell>
								<Table.Cell>
									{#if queue.parent}
										<span class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
											{queue.parent}
										</span>
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
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

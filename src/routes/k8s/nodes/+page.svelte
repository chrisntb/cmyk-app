<script lang="ts">
import CircleCheck from "@lucide/svelte/icons/circle-check";
import CircleX from "@lucide/svelte/icons/circle-x";
import Server from "@lucide/svelte/icons/server";
import { resolve } from "$app/paths";
import { fetchK8sNodes } from "$lib/api-k8s";
import * as Table from "$lib/components/ui/table/index.js";

interface Node {
	name: string;
	ready: boolean;
	roles: string;
	ip: string;
	cpu: string;
	memory: string;
	kubeletVersion: string;
}

let nodes = $state<Node[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);

async function fetchNodes() {
	try {
		nodes = await fetchK8sNodes();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch nodes";
	} finally {
		loading = false;
	}
}

function formatMemory(memory: string): string {
	const match = memory.match(/^(\d+)Ki$/);
	if (match) {
		const ki = parseInt(match[1], 10);
		const gi = ki / (1024 * 1024);
		return `${gi.toFixed(1)} Gi`;
	}
	return memory;
}

$effect(() => {
	fetchNodes();
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Server class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Nodes</h1>
	</div>
	<p class="text-muted-foreground">Cluster nodes and their status.</p>

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
						<Table.Head>Status</Table.Head>
						<Table.Head>Roles</Table.Head>
						<Table.Head>IP</Table.Head>
						<Table.Head>CPU</Table.Head>
						<Table.Head>Memory</Table.Head>
						<Table.Head>Version</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each nodes as node (node.name)}
						<Table.Row>
							<Table.Cell class="font-medium">
								<a href={resolve(`/k8s/nodes/${node.name}`)} class="text-primary hover:underline">
									{node.name}
								</a>
							</Table.Cell>
							<Table.Cell>
								{#if node.ready}
									<span class="flex items-center gap-1.5 text-green-600 dark:text-green-400">
										<CircleCheck class="size-4" />
										Ready
									</span>
								{:else}
									<span class="flex items-center gap-1.5 text-red-600 dark:text-red-400">
										<CircleX class="size-4" />
										Not Ready
									</span>
								{/if}
							</Table.Cell>
							<Table.Cell>
								{#if node.roles === '<none>'}
									<span class="text-muted-foreground">-</span>
								{:else}
									<span
										class="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
									>
										{node.roles}
									</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="font-mono text-sm">{node.ip}</Table.Cell>
							<Table.Cell>{node.cpu}</Table.Cell>
							<Table.Cell>{formatMemory(node.memory)}</Table.Cell>
							<Table.Cell class="text-muted-foreground">{node.kubeletVersion}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

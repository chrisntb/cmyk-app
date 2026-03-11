<script lang="ts">
import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
import Box from "@lucide/svelte/icons/box";
import Check from "@lucide/svelte/icons/check";
import ChevronDown from "@lucide/svelte/icons/chevron-down";
import CircleCheck from "@lucide/svelte/icons/circle-check";
import CircleDashed from "@lucide/svelte/icons/circle-dashed";
import CircleX from "@lucide/svelte/icons/circle-x";
import Clock from "@lucide/svelte/icons/clock";
import RefreshCw from "@lucide/svelte/icons/refresh-cw";
import { resolve } from "$app/paths";
import { fetchK8sPods } from "$lib/api-k8s";
import { Button } from "$lib/components/ui/button/index.js";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
import * as Table from "$lib/components/ui/table/index.js";

interface Pod {
	name: string;
	namespace: string;
	status: string;
	statusClass: string;
	node: string;
	podIP: string;
	restarts: number;
}

let pods = $state<Pod[]>([]);
let loading = $state(true);
let error = $state<string | null>(null);
let nodeFilter = $state("");
let namespaceFilter = $state("");
let refreshing = $state(false);

// DEMO HACK: rename nodes for presentation
const nodeAliases: Record<string, string> = {
	a08mlm003: "controller",
	a08mlm002: "hpc-wrk-system-1",
	a08mlm001: "hpc-wrk-compute-1",
	a08mgc005: "hpc-wrk-compute-2",
};
const nodeAlias = (node: string) => nodeAliases[node] ?? node;
const nodeName = (node: string) => nodeAliases[node] ? `${nodeAliases[node]} (${node})` : node;

let nodeNames = $derived([...new Set(pods.map((p) => p.node).filter(Boolean))].sort());
let namespaces = $derived([...new Set(pods.map((p) => p.namespace))].sort());

let filteredPods = $derived(
	pods
		.filter((p) => !nodeFilter || p.node === nodeFilter)
		.filter((p) => !namespaceFilter || p.namespace === namespaceFilter),
);

async function fetchPods() {
	try {
		pods = await fetchK8sPods();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch pods";
	} finally {
		loading = false;
		refreshing = false;
	}
}

async function refresh() {
	refreshing = true;
	error = null;
	await fetchPods();
}

function getStatusIcon(statusClass: string) {
	switch (statusClass) {
		case "running":
			return { icon: CircleCheck, class: "text-green-600 dark:text-green-400" };
		case "pending":
			return { icon: Clock, class: "text-yellow-600 dark:text-yellow-400" };
		case "succeeded":
			return { icon: CircleCheck, class: "text-blue-600 dark:text-blue-400" };
		case "failed":
			return { icon: CircleX, class: "text-red-600 dark:text-red-400" };
		case "unknown":
			return {
				icon: AlertTriangle,
				class: "text-orange-600 dark:text-orange-400",
			};
		default:
			return { icon: CircleDashed, class: "text-muted-foreground" };
	}
}

$effect(() => {
	fetchPods();
});
</script>

<div class="space-y-6">
	<div class="flex items-center gap-3">
		<Box class="size-8 text-primary" />
		<h1 class="text-3xl font-bold tracking-tight">Pods</h1>
		<Button variant="outline" size="sm" onclick={refresh} disabled={refreshing} class="ml-auto">
			<RefreshCw class="size-4 {refreshing ? 'animate-spin' : ''}" />
			Refresh
		</Button>
	</div>
	<p class="text-muted-foreground">Containers running in the cluster.</p>

	{#if loading}
		<div class="text-muted-foreground">Loading pods...</div>
	{:else if error}
		<div class="text-destructive">Error: {error}</div>
	{:else if pods.length === 0}
		<div class="text-muted-foreground">No pods found.</div>
	{:else}
		<div class="rounded-md border">
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Name</Table.Head>
						<Table.Head>
							<div class="flex flex-col gap-1">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<button
											class="flex h-7 w-36 items-center justify-between rounded border border-input bg-background px-2 text-xs font-normal text-foreground hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring"
										>
											<span class={namespaceFilter ? "" : "text-muted-foreground"}>
												{namespaceFilter || "All Namespaces"}
											</span>
											<ChevronDown class="size-3 shrink-0 text-muted-foreground" />
										</button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content class="w-36 text-xs">
										<DropdownMenu.Item class="text-xs" onclick={() => (namespaceFilter = "")}>
											<Check class="size-4 {namespaceFilter === '' ? 'opacity-100' : 'opacity-0'}" />
											All
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										{#each namespaces as ns (ns)}
											<DropdownMenu.Item class="text-xs" onclick={() => (namespaceFilter = ns)}>
												<Check class="size-4 {namespaceFilter === ns ? 'opacity-100' : 'opacity-0'}" />
												{ns}
											</DropdownMenu.Item>
										{/each}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Restarts</Table.Head>
						<Table.Head>Pod IP</Table.Head>
						<Table.Head>Node Name</Table.Head>
						<Table.Head class="w-48">
							<div class="flex flex-col gap-1">
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										<button
											class="flex h-7 w-44 items-center justify-between rounded border border-input bg-background px-2 text-xs font-normal text-foreground hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring"
										>
											<span class={nodeFilter ? "" : "text-muted-foreground"}>
												{nodeFilter ? nodeAlias(nodeFilter) : "All Nodes"}
											</span>
											<ChevronDown class="size-3 shrink-0 text-muted-foreground" />
										</button>
									</DropdownMenu.Trigger>
									<DropdownMenu.Content class="w-44 text-xs">
										<DropdownMenu.Item class="text-xs" onclick={() => (nodeFilter = "")}>
											<Check class="size-4 {nodeFilter === '' ? 'opacity-100' : 'opacity-0'}" />
											All
										</DropdownMenu.Item>
										<DropdownMenu.Separator />
										{#each nodeNames as node (node)}
											<DropdownMenu.Item class="text-xs" onclick={() => (nodeFilter = node)}>
												<Check class="size-4 {nodeFilter === node ? 'opacity-100' : 'opacity-0'}" />
												{nodeAlias(node)}
											</DropdownMenu.Item>
										{/each}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</div>
						</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each filteredPods as pod (pod.name)}
						{@const statusInfo = getStatusIcon(pod.statusClass)}
						<Table.Row>
							<Table.Cell class="font-medium">
								<a
									href={resolve(`/k8s/pods/${pod.namespace}/${pod.name}`)}
									class="text-primary hover:underline"
								>
									{pod.name}
								</a>
							</Table.Cell>
							<Table.Cell>
								<span class="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
									{pod.namespace}
								</span>
							</Table.Cell>
							<Table.Cell>
								<span class="flex items-center gap-1.5 {statusInfo.class}">
									<statusInfo.icon class="size-4" />
									{pod.status}
								</span>
							</Table.Cell>
							<Table.Cell>
								{#if pod.restarts > 0}
									<span class="text-orange-600 dark:text-orange-400">{pod.restarts}</span>
								{:else}
									<span class="text-muted-foreground">0</span>
								{/if}
							</Table.Cell>
							<Table.Cell class="font-mono text-sm">{pod.podIP || '-'}</Table.Cell>
							<Table.Cell class="font-mono text-sm text-muted-foreground">{pod.node || '-'}</Table.Cell>
							<Table.Cell class="text-muted-foreground">{pod.node ? nodeAlias(pod.node) : '-'}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>

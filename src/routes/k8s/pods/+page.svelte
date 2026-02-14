<script lang="ts">
import AlertTriangle from "@lucide/svelte/icons/alert-triangle";
import Box from "@lucide/svelte/icons/box";
import CircleCheck from "@lucide/svelte/icons/circle-check";
import CircleDashed from "@lucide/svelte/icons/circle-dashed";
import CircleX from "@lucide/svelte/icons/circle-x";
import Clock from "@lucide/svelte/icons/clock";
import { resolve } from "$app/paths";
import { fetchK8sPods } from "$lib/api-k8s";
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

async function fetchPods() {
	try {
		pods = await fetchK8sPods();
	} catch (e) {
		error = e instanceof Error ? e.message : "Failed to fetch pods";
	} finally {
		loading = false;
	}
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
						<Table.Head>Namespace</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Restarts</Table.Head>
						<Table.Head>Pod IP</Table.Head>
						<Table.Head>Node</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each pods as pod (pod.name)}
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
							<Table.Cell class="text-muted-foreground">{pod.node}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{/if}
</div>
